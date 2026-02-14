import path from "path";
import { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // When using `pnpm link` for local SDK development, webpack may resolve
    // react/react-dom from the linked package's node_modules (different version),
    // causing the "two Reacts" problem. Force resolution to this project's copy.
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        react: path.resolve("./node_modules/react"),
        "react-dom": path.resolve("./node_modules/react-dom"),
      },
    };
    return config;
  },
};

export default config;
