import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { IconLogout } from "@tabler/icons-react";

export function LogoutButton() {
  const { handleLogOut } = useDynamicContext();

  return (
    <button onClick={handleLogOut} className="flex items-center gap-2">
      <IconLogout className="mr-2 h-4 w-4" />
      <span>Sign Out</span>
    </button>
  );
}
