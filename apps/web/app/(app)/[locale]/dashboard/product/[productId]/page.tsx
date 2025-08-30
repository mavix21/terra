import type { Metadata } from "next";
import { Suspense } from "react";

import ProductViewPage from "@/pages/products/ui/product-view-page";
import FormCardSkeleton from "@/shared/ui/form-card-skeleton";
import PageContainer from "@/shared/ui/layout/page-container";

export const metadata: Metadata = {
  title: "Dashboard : Product View",
};

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ProductViewPage productId={params.productId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
