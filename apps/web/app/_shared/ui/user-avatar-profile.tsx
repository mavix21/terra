import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@terra/ui/components/avatar";

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: {
    imageUrl?: string;
    fullName?: string | null;
    email?: string | null;
  } | null;
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user,
}: UserAvatarProfileProps) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className={className}>
        <AvatarImage src={user?.imageUrl ?? ""} alt={user?.fullName ?? ""} />
        <AvatarFallback className="rounded-lg">
          {user?.fullName?.slice(0, 2).toUpperCase() ?? "CN"}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">
            {user?.fullName ?? "null"}
          </span>
          <span className="truncate text-xs">{user?.email ?? ""}</span>
        </div>
      )}
    </div>
  );
}
