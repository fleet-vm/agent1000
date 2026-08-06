import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the root. There is a stray package-lock.json in the home directory
  // above this project, and Turbopack's automatic root detection walks up to
  // it and warns on every build.
  turbopack: { root: path.join(__dirname) },

  // The site is frontend-only: no server actions, no route handlers, no image
  // optimisation. `npm run build` emits a static `out/` directory.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
