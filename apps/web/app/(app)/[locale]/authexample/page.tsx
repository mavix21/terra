import SessionData from "@/app/(app)/_ui/session-data";
import { auth } from "@/auth";
import { Link } from "@/shared/i18n";

export default async function Page() {
  const session = await auth();
  return (
    <div className="space-y-2">
      <Link href="/">Home</Link>
      <h1 className="text-3xl font-bold">React Server Component Usage</h1>
      <p>
        This page is server-rendered as a React Server Component. It gets the
        session data on the server using the <code>auth()</code> method.
      </p>
      <SessionData session={session} />
    </div>
  );
}
