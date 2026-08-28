import {
  defineConfig,
  globalIgnores,
} from "eslint/config";

import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  /*
   * React Compiler-oriented rules
   *
   * The application is not currently configured
   * to use the React Compiler.
   *
   * These rules currently flag established,
   * working application patterns around:
   *
   * - one-time browser-storage hydration
   * - ref-backed preview measurement
   * - ref-backed drag interactions
   * - effect-driven UI synchronisation
   *
   * Keep the standard Hooks correctness rules
   * enabled, including exhaustive-deps.
   *
   * Revisit these rules if React Compiler support
   * is intentionally introduced later.
   */
  {
    rules: {
      "react-hooks/set-state-in-effect":
        "off",

      "react-hooks/purity":
        "off",

      "react-hooks/immutability":
        "off",

      "react-hooks/refs":
        "off",
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;