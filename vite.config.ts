import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/abyssal-labyrinth/",
  plugins: [topLevelAwait()],
});
