import { defineConfig } from "astro/config";
import nodejs from "@astrojs/node";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: node({
    mode: "standalone"
  })
});