import { env } from "@/env";

export const BASE_URL =
  env.NODE_ENV === "production"
    ? // eslint-disable-next-line no-restricted-properties
      `https://${process.env.NEXT_PUBLIC_URL}`
    : "http://localhost:3000";

export const COFFEE_VERIFICATION_CONTRACT_ADDRESS =
  "0xD3d0E2DAe69D3C9A69D84715F34073b6caa5De9B" as const;
