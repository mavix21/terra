"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { parseEther, parseEventLogs } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import * as z from "zod";

import type { Id } from "@terra/convex/convex/_generated/dataModel";
import { api } from "@terra/convex/convex/_generated/api";
import { Button } from "@terra/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@terra/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@terra/ui/components/form";
import { Input } from "@terra/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@terra/ui/components/select";
import { Textarea } from "@terra/ui/components/textarea";

import { uploadCoffeeVerificationJSON } from "@/app/_shared/api/pinata/route";
import { abi } from "@/lib/abi";
import { COFFEE_VERIFICATION_CONTRACT_ADDRESS } from "@/lib/constants";
import { useRouter } from "@/shared/i18n";
import { FileUploader } from "@/shared/ui/file-uploader";

const _MAX_FILE_SIZE = 5000000;
const _ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  // For metadata only
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  // Microlot fields
  variety: z.string().min(1, { message: "Variety is required." }),
  altitude: z.coerce
    .number({ invalid_type_error: "Altitude must be a number." })
    .min(0, { message: "Altitude must be positive." }),
  harvestDate: z.string().min(1, { message: "Harvest date is required." }),
  processingMethod: z.string().min(1, { message: "Processing is required." }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  family: z.string().min(1, { message: "Family is required." }),
  estate: z.string().min(1, { message: "Estate is required." }),
  totalSupply: z.coerce
    .number({ invalid_type_error: "Supply must be a number." })
    .min(1, { message: "At least 1 token is required." }),
  pricePerTokenEth: z.coerce
    .number({ invalid_type_error: "Price must be a number." })
    .positive({ message: "Price must be greater than 0." }),
  // Optional image for future use
  image: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const uploadMetadata = uploadCoffeeVerificationJSON as (
  name: string,
  variety: string,
  altitude: number,
  harvestDate: string,
  processingMethod: string,
  imageStorageId?: Id<"_storage">,
) => Promise<{ cid: string } | undefined>;

export default function ProductForm({
  initialData: _initialData,
  pageTitle,
}: {
  initialData: null;
  pageTitle: string;
}) {
  const defaultValues: FormValues = useMemo(
    () => ({
      name: "",
      variety: "",
      altitude: 0,
      harvestDate: new Date().toISOString().slice(0, 10),
      processingMethod: "Washed",
      description: "",
      family: "",
      estate: "",
      totalSupply: 1,
      pricePerTokenEth: 1,
      image: undefined,
    }),
    [],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const createMicrolot = useMutation(api.microlots.createMicrolot);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const { data: hash, isPending, writeContract } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    data,
  } = useWaitForTransactionReceipt({ hash });

  const [pending, setPending] = useState<
    | (FormValues & {
        metadataCid: string;
        priceEth: number;
        imageId?: Id<"_storage">;
      })
    | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && pending) {
      for (const log of data.logs) {
        const events = parseEventLogs({
          abi,
          logs: [log],
        });
        for (const event of events) {
          if (event.eventName === "CoffeeListed") {
            const { tokenId } = event.args;
            const metadataURI = `https://rose-gentle-toucan-395.mypinata.cloud/ipfs/${pending.metadataCid}`;
            void createMicrolot({
              microlot: {
                tokenId: Number(tokenId),
                variety: pending.variety,
                altitude: pending.altitude,
                harvestDate: pending.harvestDate,
                processingMethod: pending.processingMethod,
                description: pending.description,
                family: pending.family,
                estate: pending.estate,
                totalSupply: pending.totalSupply,
                pricePerTokenEth: pending.priceEth,
                metadataURI,
                image: pending.imageId,
              },
            })
              .then(() => {
                form.reset(defaultValues);
                setPending(null);
                setIsSubmitting(false);
                router.push("/dashboard/product");
              })
              .catch((err: unknown) => {
                console.error(err instanceof Error ? err.message : err);
                setIsSubmitting(false);
              });
            return;
          }
        }
      }
    }
  }, [isSuccess, data, pending, createMicrolot, form, defaultValues, router]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      let imageId: Id<"_storage"> | undefined = undefined;
      if (values.image) {
        const file = values.image;
        const uploadUrl: string = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const json = (await res.json()) as { storageId: Id<"_storage"> };
        imageId = json.storageId;
      }

      const uploadResult = await uploadMetadata(
        values.name,
        values.variety,
        values.altitude,
        values.harvestDate,
        values.processingMethod,
        imageId,
      );
      if (!uploadResult?.cid) {
        throw new Error("Failed to upload metadata to IPFS");
      }

      writeContract({
        address: COFFEE_VERIFICATION_CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: "listCoffee",
        args: [
          BigInt(values.totalSupply),
          `https://rose-gentle-toucan-395.mypinata.cloud/ipfs/${uploadResult.cid}`,
          parseEther(values.pricePerTokenEth.toString()),
        ],
      });

      setPending({
        ...values,
        metadataCid: uploadResult.cid,
        priceEth: values.pricePerTokenEth,
        imageId,
      });
    } catch (e: unknown) {
      console.error(e instanceof Error ? e.message : e);
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value ? [field.value] : []}
                        onValueChange={(next) => {
                          const nextFiles = next as File[];
                          const file = nextFiles[0];
                          field.onChange(file ?? undefined);
                        }}
                        maxFiles={1}
                        maxSize={4 * 1024 * 1024}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot Name (for metadata)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. El Paraiso Lot #1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="variety"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variety</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Arabica" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="altitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altitude (m)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="1000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="harvestDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harvest Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="processingMethod"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Processing</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select processing" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Washed">Washed</SelectItem>
                        <SelectItem value="Natural">Natural</SelectItem>
                        <SelectItem value="Honey">Honey</SelectItem>
                        <SelectItem value="Anaerobic">Anaerobic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="family"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family</FormLabel>
                    <FormControl>
                      <Input placeholder="Family" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estate</FormLabel>
                    <FormControl>
                      <Input placeholder="Estate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalSupply"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Supply (tokens)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        placeholder="100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricePerTokenEth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Token (ETH)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="1.0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter lot description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={isSubmitting || isPending || isConfirming}
              >
                {isSubmitting || isPending || isConfirming
                  ? "Processing..."
                  : "Create Microlot"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
