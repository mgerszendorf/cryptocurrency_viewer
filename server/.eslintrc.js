module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: [
    "@typescript-eslint",
    "prettier",
    "@typescript-eslint/eslint-plugin",
    "sort-imports-es6-autofix",
  ],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/prefer-default-export": 0,
    "no-throw-literal": 0,
    "prefer-const": 0,
    "no-console": 0,
    "no-prototype-builtins": 0,
    "security/detect-object-injection": 0,
    "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_", args: "none" }],
    "sort-imports-es6-autofix/sort-imports-es6": [
      "error",
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "single", "all", "multiple"],
      },
    ],
  },
};
