import type { Metadata } from "next";
import { cookies } from "next/headers";
import { DynamicUserProfile } from "@dynamic-labs/sdk-react-core";

import { SidebarInset, SidebarProvider } from "@terra/ui/components/sidebar";

import KBar from "@/shared/ui/kbar";
import AppSidebar from "@/shared/ui/layout/app-sidebar";
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
          <SidebarInset>
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
