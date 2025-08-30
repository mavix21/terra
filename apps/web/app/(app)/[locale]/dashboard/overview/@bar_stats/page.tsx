import { BarGraph } from "@/pages/dashboard/overview/ui/bar-graph";
import { delay } from "@/shared/data/mock-api";

export default async function BarStats() {
  await await delay(1000);

  return <BarGraph />;
}
