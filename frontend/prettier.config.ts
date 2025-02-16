import { type Config } from "prettier";

const config: Config = {
  trailingComma: "none",
  "plugins": ["prettier-plugin-tailwindcss"],
};

module.exports = config;