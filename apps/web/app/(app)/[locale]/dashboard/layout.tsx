import type { Metadata } from "next";
import { cookies } from "next/headers";
import { DynamicUserProfile } from "@dynamic-labs/sdk-react-core";

import { SidebarInset, SidebarProvider } from "@terra/ui/components/sidebar";

import AppSidebar from "@/app/(app)/[locale]/dashboard/app-sidebar";
import KBar from "@/shared/ui/kbar";
import Header from "@/shared/ui/layout/header";

export const metadata: Metadata = {
  title: "Next Shadcn Dashboard Starter",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <>
      <KBar>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset className="overflow-y-hidden">
            <Header />
            {/* page main content */}
            {children}
            {/* page main content ends */}
          </SidebarInset>
        </SidebarProvider>
      </KBar>
      <DynamicUserProfile />
    </>
  );
}
