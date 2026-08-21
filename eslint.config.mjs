import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Maquetas de diseño: `support.js` es el runtime de Claude Design, código
    // de terceros que no se edita a mano, y los `.dc.html` no son de la app.
    // Lintearlos solo ensucia la salida con errores que no se van a corregir.
    "mockups/**",
  ]),
]);

export default eslintConfig;
