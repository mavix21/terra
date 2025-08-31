import type { Metadata } from "next";
import Image from "next/image";
import { DynamicEmbeddedWidget } from "@dynamic-labs/sdk-react-core";

import { buttonVariants } from "@terra/ui/components/button";
import { cn } from "@terra/ui/lib/utils";

import { Link } from "@/shared/i18n";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function SignInViewPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-4 right-4 hidden md:top-8 md:right-8",
        )}
      >
        Login
      </Link>
      <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
        <Image
          src="/sign-in.jpeg"
          alt="Sign in background"
          fill
          priority
          className="object-cover"
        />
        <div className="relative z-20 flex items-center text-xl font-medium">
          Terra 🌱
        </div>
      </div>
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          {/* github link  */}
          {/* <ClerkSignInForm
            initialValues={{
              emailAddress: "your_mail+clerk_test@example.com",
            }}
          /> */}
          <div className="w-full">
            <DynamicEmbeddedWidget background="with-border" />
          </div>

          <p className="text-muted-foreground px-8 text-center text-sm">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-primary underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-primary underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
