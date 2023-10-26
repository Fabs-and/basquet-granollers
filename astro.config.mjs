import { defineConfig } from "astro/config";
// import hnodejs from "@astrojs/node";

// import netlify from "@astrojs/netlify/functions";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  // adapter: netlify(),
  //By default Astro will build your site as a static site, but you can also build it as a server-rendered site by setting the output option to server. Change to hybrid to by default being a static site generated
  // output: "hybrid",
  image: {
    domains: ["astro.build"],
  },
  integrations: [svelte()]
});