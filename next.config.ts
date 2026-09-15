import path from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Pin the root. There is a stray package-lock.json in the home directory
  // above this project, and Turbopack's automatic root detection walks up to
  // it and warns on every build.
  turbopack: { root: path.join(__dirname) },

  // The site is frontend-only: no server actions, no route handlers, no image
  // optimisation. `npm run build` emits a static `out/` directory.
  output: "export",
  images: { unoptimized: true },

  // Blog posts are MDX files under `src/content/blog/`, imported by
  // `src/app/blog/[slug]/page.tsx`. They are never routes themselves.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  // Plugins are named as strings so Turbopack can load them; a function here
  // is a build error. GFM brings tables, strikethrough and task lists -- the
  // markdown a writer expects to work.
  options: { remarkPlugins: ["remark-gfm"] },
});

export default withMDX(nextConfig);
