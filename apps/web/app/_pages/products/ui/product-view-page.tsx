import { notFound } from "next/navigation";

import { fakeProducts } from "@/shared/data/mock-api";

import ProductForm from "./product-form";

interface TProductViewPageProps {
  productId: string;
}

export default async function ProductViewPage({
  productId,
}: TProductViewPageProps) {
  let product = null;
  let pageTitle = "Create New Product";

  if (productId !== "new") {
    const data = await fakeProducts.getProductById(Number(productId));
    product = data.product;
    if (!product) {
      notFound();
    }
    pageTitle = `Edit Product`;
  }

  return <ProductForm initialData={null} pageTitle={pageTitle} />;
}
