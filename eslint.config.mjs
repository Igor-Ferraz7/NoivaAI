import react from "eslint-plugin-react";

export default [
  {
    ignores: ["node_modules/**", ".next/**", "dist/**", "test-results/**", "playwright-report/**"]
  },
  {
    files: ["**/*.{js,jsx,mjs}"],
    plugins: { react },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    rules: {
      // Sem jsx-uses-vars, o no-unused-vars não vê o uso de componentes em JSX.
      "react/jsx-uses-vars": "error",
      "no-unused-vars": "error"
    }
  }
];
