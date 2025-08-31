"use client";

import * as React from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import {
  IconChevronRight,
  IconChevronsDown,
  IconPhotoUp,
} from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";

import { api } from "@terra/convex/convex/_generated/api";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@terra/ui/components/collapsible";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@terra/ui/components/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@terra/ui/components/sidebar";
import { useMediaQuery } from "@terra/ui/hooks/use-media-query";
import { Icons } from "@terra/ui/icons";

import { useProfile } from "@/app/(app)/_providers";
import { buyerNavItems, producerNavItems } from "@/shared/data/nav-items";
import { Link, usePathname } from "@/shared/i18n";
import { OrgSwitcher } from "@/shared/ui/org-switcher";
import { UserAvatarProfile } from "@/shared/ui/user-avatar-profile";

export const company = {
  name: "Acme Inc",
  logo: IconPhotoUp,
  plan: "Enterprise",
};

const tenants = [
  { id: "1", name: "Producer" },
  { id: "2", name: "Buyer" },
];

export default function AppSidebar() {
  const { setShowDynamicUserProfile } = useDynamicContext();
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const { data: session } = useSession();
  const user = session?.user ?? null;
  const { profile, setProfile } = useProfile();
  const userId = user?.convexUserId ?? null;
  const buyerVerification = useQuery(
    api.buyerVerification.getForUser,
    (() => (userId ? { userId } : "skip"))(),
  );
  const showSsiPulse = (() => {
    if (userId === null) return false;
    if (buyerVerification === undefined) return false; // still loading
    if (buyerVerification === null) return true; // never submitted
    return buyerVerification.isVerified !== true;
  })();
  const handleSwitchTenant = (_tenantId: string) => {
    // Map tenants to profiles for demo: id "1" -> producer, others -> buyer
    if (_tenantId === "1") setProfile("producer");
    else setProfile("buyer");
  };

  const [activeTenantId, setActiveTenantId] = React.useState<string>(
    tenants[0]?.id ?? "1",
  );

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <OrgSwitcher
          tenants={tenants}
          selectedTenantId={activeTenantId}
          onTenantSwitchAction={(id) => {
            setActiveTenantId(id);
            handleSwitchTenant(id);
          }}
          showVerifiedBadge={
            activeTenantId === "2" && buyerVerification?.isVerified === true
          }
        />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {(profile === "producer"
              ? producerNavItems
              : [
                  ...buyerNavItems,
                  ...(buyerVerification?.isVerified
                    ? [
                        {
                          title: "Buy lot",
                          url: "/dashboard/buy",
                          icon: "product",
                          isActive: false,
                          items: [],
                        } as const,
                      ]
                    : []),
                ]
            ).map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item.items && item.items.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                      {item.url === "/dashboard/ssi" && showSsiPulse && (
                        <span
                          className="bg-primary ml-2 inline-block h-2 w-2 animate-pulse rounded-full"
                          aria-label="Action required"
                        />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  onClick={() => setShowDynamicUserProfile(true)}
                >
                  {user && (
                    <UserAvatarProfile
                      className="h-8 w-8 rounded-lg"
                      showInfo
                      user={user}
                    />
                  )}
                  <IconChevronsDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
