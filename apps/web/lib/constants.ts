import { env } from "@/env";

export const BASE_URL =
  env.NODE_ENV === "production"
    ? // eslint-disable-next-line no-restricted-properties
      `https://${process.env.NEXT_PUBLIC_URL}`
    : "http://localhost:3000";

export const COFFEE_VERIFICATION_CONTRACT_ADDRESS =
  "0xaa18e4F24941959310A1177088B515dF214182b1" as const;
