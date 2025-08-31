import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@terra/ui/components/sonner";

import "@terra/ui/globals.css";

import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { auth } from "@/auth";
import { routing } from "@/shared/i18n/routing";
import { ThemeProvider } from "@/shared/ui/theme-provider";

import {
  ConvexClientProvider,
  OnchainProviders,
  ProfileProvider,
} from "../_providers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Terra",
  description: "From farm to cup",
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const session = await auth();
  const cookie = (await headers()).get("cookie");

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <NextTopLoader showSpinner={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <ConvexClientProvider session={session}>
              <OnchainProviders cookie={cookie}>
                <ProfileProvider>
                  <NuqsAdapter>{children}</NuqsAdapter>
                </ProfileProvider>
              </OnchainProviders>
            </ConvexClientProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
