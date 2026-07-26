import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/** GitHub Pages project site: https://<user>.github.io/Portfolio_Website/ */
const githubPagesBase = "/";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: process.env.GITHUB_PAGES === "true" ? githubPagesBase : "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
