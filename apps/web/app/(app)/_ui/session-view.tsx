"use client";

import { useSession } from "next-auth/react";

import SessionData from "./session-data";

export function SessionView() {
  const { data: session } = useSession();
  console.log("session", session);
  return <SessionData session={session} />;
}
