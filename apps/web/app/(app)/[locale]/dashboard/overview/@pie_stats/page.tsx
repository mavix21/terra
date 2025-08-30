import { PieGraph } from "@/pages/dashboard/overview/ui/pie-graph";
import { delay } from "@/shared/data/mock-api";

export default async function Stats() {
  await delay(1000);
  return <PieGraph />;
}
