import { defineConfig } from "astro/config";
// import hnodejs from "@astrojs/node";

import netlify from "@astrojs/netlify/functions";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  output: "hybrid",
  integrations: [svelte()]
});