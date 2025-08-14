import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable image optimization warnings for development
      "@next/next/no-img-element": "off",
      
      // Allow unused variables with underscore prefix
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_" 
      }],
      
      // Allow explicit any in some cases (for external libraries)
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Make React hooks deps less strict
      "react-hooks/exhaustive-deps": "warn",
      
      // Allow unescaped entities in JSX
      "react/no-unescaped-entities": "off"
    }
  }
];

export default eslintConfig;
