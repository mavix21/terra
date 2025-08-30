import type { Metadata } from "next";

import ProductViewPage from "@/app/_pages/products/ui/product-view-page";

export const metadata: Metadata = {
  title: "Dashboard : Product View",
};

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductPage(props: PageProps) {
  const params = await props.params;
  return <ProductViewPage productId={params.productId} />;
}
