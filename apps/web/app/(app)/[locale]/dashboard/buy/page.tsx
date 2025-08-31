import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

import { DataTableSkeleton } from "@terra/ui/components/table/data-table-skeleton";

import { BuyLot } from "@/app/_pages/buy/buy-lot";
import PageContainer from "@/shared/ui/layout/page-container";
import { searchParamsCache } from "@/shared/utils/searchparams";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BuyPage(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={0} />
          }
        >
          <BuyLot />
        </Suspense>
      </div>
    </PageContainer>
  );
}
