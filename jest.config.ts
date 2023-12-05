import type { Config } from "jest";

const config: Config = {
  verbose: true,
  rootDir: ".",
  roots: ["./src"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
};

export default config;
