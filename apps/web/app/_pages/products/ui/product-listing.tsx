import type { Product } from "@/shared/data/mock-api";
import { fakeProducts } from "@/shared/data/mock-api";
import { searchParamsCache } from "@/shared/utils/searchparams";

import { ProductTable } from "./product-tables";
import { columns } from "./product-tables/columns";

interface ProductListingPage {}

export default async function ProductListingPage({}: ProductListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const categories = searchParamsCache.get("category");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories }),
  };

  const data = await fakeProducts.getProducts(filters);
  const totalProducts = data.total_products;
  const products: Product[] = data.products;

  return (
    <ProductTable
      data={products}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
