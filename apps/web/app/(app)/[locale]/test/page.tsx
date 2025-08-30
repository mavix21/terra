import { useQuery } from "convex/react";

import { api } from "@terra/convex/convex/_generated/api";
import { Button } from "@terra/ui/components/button";

export default function TestPage() {
  const microlots = useQuery(api.microlots.getAvailableMicrolots);
  return (
    <div>
      <Button
        onClick={() => {
          console.log(microlots);
        }}
      >
        Crear café
      </Button>
    </div>
  );
}
