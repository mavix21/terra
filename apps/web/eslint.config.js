import baseConfig, { restrictEnvAccess } from "@terra/eslint-config/base";
import nextjsConfig from "@terra/eslint-config/next-js";
import reactConfig from "@terra/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
