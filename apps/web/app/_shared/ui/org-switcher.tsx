"use client";

import * as React from "react";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@terra/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@terra/ui/components/sidebar";

interface Tenant {
  id: string;
  name: string;
}

export function OrgSwitcher({
  tenants,
  selectedTenantId,
  onTenantSwitchAction,
  showVerifiedBadge,
}: {
  tenants: Tenant[];
  selectedTenantId: string;
  onTenantSwitchAction?: (tenantId: string) => void;
  showVerifiedBadge?: boolean;
}) {
  if (tenants.length === 0) return null;

  const foundTenant = tenants.find((t) => t.id === selectedTenantId);
  const selectedName = foundTenant?.name ?? tenants[0]?.name ?? "";

  const handleTenantSwitch = (tenant: Tenant) => {
    onTenantSwitchAction?.(tenant.id);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="text-primary-foreground size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Terra</span>
                <span className="flex items-center gap-2">
                  {selectedName}
                  {showVerifiedBadge === true && (
                    <span className="inline-flex items-center gap-1 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/40 dark:text-green-200">
                      <svg viewBox="0 0 20 20" className="size-3" aria-hidden>
                        <path
                          fill="currentColor"
                          d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm3.707-9.707a1 1 0 0 0-1.414-1.414L9 10.172 7.707 8.879a1 1 0 1 0-1.414 1.414L9 13.0l4.707-4.707Z"
                        />
                      </svg>
                      Verified
                    </span>
                  )}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {tenants.map((tenant) => (
              <DropdownMenuItem
                key={tenant.id}
                onSelect={() => handleTenantSwitch(tenant)}
              >
                {tenant.name}{" "}
                {tenant.id === selectedTenantId && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
