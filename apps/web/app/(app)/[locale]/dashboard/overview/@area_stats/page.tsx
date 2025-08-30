import { AreaGraph } from "@/pages/dashboard/overview/ui/area-graph";
import { delay } from "@/shared/data/mock-api";

export default async function AreaStats() {
  await await delay(2000);
  return <AreaGraph />;
}
