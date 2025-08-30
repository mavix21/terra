import { env } from "@/env";

export const BASE_URL =
  env.NODE_ENV === "production"
    ? // eslint-disable-next-line no-restricted-properties
      `https://${process.env.NEXT_PUBLIC_URL}`
    : "http://localhost:3000";

export const COFFEE_VERIFICATION_CONTRACT_ADDRESS =
  "0xb0b87c1269D82c4b6F5f1e8b5c800701e92A1933" as const;
