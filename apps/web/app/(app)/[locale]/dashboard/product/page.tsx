import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { IconPlus } from "@tabler/icons-react";

import { buttonVariants } from "@terra/ui/components/button";
import { Heading } from "@terra/ui/components/heading";
import { Separator } from "@terra/ui/components/separator";
import { DataTableSkeleton } from "@terra/ui/components/table/data-table-skeleton";
import { cn } from "@terra/ui/lib/utils";

import ProductListingPage from "@/pages/products/ui/product-listing";
import { Link } from "@/shared/i18n";
import PageContainer from "@/shared/ui/layout/page-container";
import { searchParamsCache } from "@/shared/utils/searchparams";

export const metadata: Metadata = {
  title: "Dashboard: Products",
};

interface pageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  // const key = serialize({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Products" description="Manage products" />
          <Link
            href="/dashboard/product/new"
            className={cn(buttonVariants(), "text-xs md:text-sm")}
          >
            <IconPlus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <ProductListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
