import { env } from "@/env";

export const BASE_URL =
  env.NODE_ENV === "production"
    ? // eslint-disable-next-line no-restricted-properties
      `https://${process.env.NEXT_PUBLIC_URL}`
    : "http://localhost:3000";
