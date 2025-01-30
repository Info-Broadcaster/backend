module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2020: true,
    },
    extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended", "prettier"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        "prettier/prettier": "error",
        "react/prop-types": "off",
        "no-unused-vars": "warn",
        "no-console": "warn",
    },
};
