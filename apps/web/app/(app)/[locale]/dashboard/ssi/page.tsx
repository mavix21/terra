"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
  const userEmail = session?.user?.email ?? "";

  const userId = useQuery(api.users.getUserIdByEmail, { email: userEmail });
  const existing = useQuery(
    api.buyerVerification.getForUser,
    userId ? { userId } : "skip",
  );

  const upsert = useMutation(api.buyerVerification.upsert);

  const defaultValues: FormValues = useMemo(
    () => ({
      businessName: existing?.businessName ?? "",
      taxId: existing?.taxId ?? "",
      licenseId: existing?.licenseId ?? "",
      certifications: existing?.certifications?.join(", ") ?? "",
      contactEmail: existing?.contactEmail ?? session?.user?.email ?? "",
      contactPhone: existing?.contactPhone ?? "",
      addressLine1: existing?.addressLine1 ?? "",
      addressLine2: existing?.addressLine2 ?? "",
      city: existing?.city ?? "",
      state: existing?.state ?? "",
      country: existing?.country ?? "",
      postalCode: existing?.postalCode ?? "",
    }),
    [existing, session?.user?.email],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          Self-Sovereign Identity Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      <Input placeholder="Business Tax ID" {...field} />
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
                      <Input placeholder="License ID" {...field} />
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
                      <Input placeholder="+1 555 123 4567" {...field} />
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
                      <Input placeholder="Street address" {...field} />
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
                      <Input placeholder="City" {...field} />
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
                      <Input placeholder="State or region" {...field} />
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
                      <Input placeholder="Country" {...field} />
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
                      <Input placeholder="ZIP or postal code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isSubmitting || !userId}>
                {isSubmitting
                  ? "Saving..."
                  : existing
                    ? "Update Verification"
                    : "Verify"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
