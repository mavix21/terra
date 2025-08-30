import { RecentSales } from "@/pages/dashboard/overview/ui/recent-sales";
import { delay } from "@/shared/data/mock-api";

export default async function Sales() {
  await delay(3000);
  return <RecentSales />;
}
