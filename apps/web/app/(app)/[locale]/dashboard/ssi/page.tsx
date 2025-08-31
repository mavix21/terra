"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { api } from "@terra/convex/convex/_generated/api";
import { Button } from "@terra/ui/components/button";
import { Card, CardContent } from "@terra/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@terra/ui/components/form";
import { Heading } from "@terra/ui/components/heading";
import { Input } from "@terra/ui/components/input";

import PageContainer from "@/app/_shared/ui/layout/page-container";

const formSchema = z.object({
  businessName: z.string().min(2, { message: "Business name is required." }),
  taxId: z.string().min(2, { message: "Tax ID is required." }),
  licenseId: z.string().min(2, { message: "Business license is required." }),
  certifications: z.string().optional(), // comma-separated list
  contactEmail: z.string().email({ message: "Valid email required." }),
  contactPhone: z.string().optional(),
  addressLine1: z.string().min(2, { message: "Address line 1 is required." }),
  addressLine2: z.string().optional(),
  city: z.string().min(1, { message: "City is required." }),
  state: z.string().min(1, { message: "State is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  postalCode: z.string().min(2, { message: "Postal code is required." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SsiPage() {
  const { data: session } = useSession();
  const userId = session?.user.convexUserId ?? null;
  const userEmail = session?.user.email ?? "";

  const existing = useQuery(
    api.buyerVerification.getForUser,
    userId ? { userId } : "skip",
  );

  const upsert = useMutation(api.buyerVerification.upsert);
  const [showSuccess, setShowSuccess] = useState(false);

  const defaultValues: FormValues = useMemo(
    () => ({
      businessName: existing?.businessName ?? "",
      taxId: existing?.taxId ?? "",
      licenseId: existing?.licenseId ?? "",
      certifications: existing?.certifications.join(", ") ?? "",
      contactEmail: existing?.contactEmail ?? userEmail,
      contactPhone: existing?.contactPhone ?? "",
      addressLine1: existing?.addressLine1 ?? "",
      addressLine2: existing?.addressLine2 ?? "",
      city: existing?.city ?? "",
      state: existing?.state ?? "",
      country: existing?.country ?? "",
      postalCode: existing?.postalCode ?? "",
    }),
    [existing, userEmail],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isVerified = (existing?.isVerified ?? false) || showSuccess;

  async function onSubmit(values: FormValues) {
    if (!userId) return;
    setIsSubmitting(true);
    try {
      const certs = (values.certifications ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await upsert({
        userId,
        businessName: values.businessName,
        taxId: values.taxId,
        licenseId: values.licenseId,
        certifications: certs,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        country: values.country,
        postalCode: values.postalCode,
        isVerified: true,
      });
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageContainer>
      <div className="w-full space-y-4">
        <Heading
          title="Self-Sovereign Identity Verification"
          description="Verify your identity to access the platform"
        />
        <Card className="mx-auto w-full">
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your legal business name"
                            {...field}
                            readOnly={isVerified}
                            disabled={isVerified}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Business Tax ID"
                            {...field}
                            readOnly={isVerified}
                            disabled={isVerified}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licenseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business License</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="License ID"
                            {...field}
                            readOnly={isVerified}
                            disabled={isVerified}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="certifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certifications (comma separated)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Organic, Fair Trade"
                            {...field}
                            readOnly={isVerified}
                            disabled={isVerified}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@company.com"
                            {...field}
                            readOnly={isVerified}
                            disabled={isVerified}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 555 123 4567"
                            {...field}
                            readOnly={isVerified}
                            disabled={isVerified}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Street address"
                            {...field}
                            readOnly={isVerified}
                            disabled={isVerified}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Apt, suite, etc. (optional)"
                            {...field}
                            readOnly={isVerified}
                            disabled={isVerified}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City"
                            {...field}
                            readOnly={isVerified}
                            disabled={isVerified}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Region</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="State or region"
                            {...field}
                            readOnly={isVerified}
                            disabled={isVerified}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Country"
                            {...field}
                            readOnly={isVerified}
                            disabled={isVerified}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ZIP or postal code"
                            {...field}
                            readOnly={isVerified}
                            disabled={isVerified}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!isVerified && (
                  <div className="flex items-center gap-3">
                    <Button type="submit" disabled={isSubmitting || !userId}>
                      {isSubmitting
                        ? "Saving..."
                        : existing
                          ? "Update Verification"
                          : "Verify"}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-500/10 p-6 ring-green-500/30 backdrop-blur-sm dark:bg-green-900/20">
            <div className="bg-background relative w-full max-w-md rounded-xl border border-green-500/30 p-6 shadow-2xl">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-green-500/15">
                <svg
                  viewBox="0 0 24 24"
                  className="animate-in fade-in zoom-in size-8 text-green-600"
                  aria-hidden
                >
                  <path
                    fill="currentColor"
                    d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-1 14l-4-4 1.414-1.414L11 12.172l4.586-4.586L17 9l-6 7Z"
                  />
                </svg>
              </div>
              <h3 className="text-center text-xl font-semibold">
                You're verified!
              </h3>
              <p className="text-muted-foreground mt-2 text-center">
                You now have access to buying coffee lots.
              </p>
              <div className="mt-6 flex justify-center">
                <Button onClick={() => setShowSuccess(false)}>Continue</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
