import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const HERE = import.meta.dirname;

export default defineConfig({
  root: HERE,
  // Isolate dep cache from the editor app so `dev:all` doesn't cause the two
  // Vite instances to overwrite each other's pre-bundled deps.
  cacheDir: path.resolve(HERE, "node_modules/.vite"),
  // host: true binds to 0.0.0.0 (IPv4) + :: (IPv6) so localhost, 127.0.0.1,
  // and the LAN IP all work. Without this, Vite binds IPv6-only on some
  // Linux setups and http://127.0.0.1:3030 refuses connections.
  server: { port: 3030, host: true, open: false, strictPort: true },
  plugins: [react()],
  optimizeDeps: {
    // Force-include so Vite pre-bundles these at startup instead of discovering
    // them mid-session (which triggers 504 Outdated Optimize Dep).
    include: ["react", "react-dom", "react-dom/client", "framer-motion", "use-sound"],
  },
  resolve: {
    alias: {
      // Shared assets: point at the library/ folder Remotion also reads from.
      // apps/slides → repo root is ../.. — then library/
      "@library": path.resolve(HERE, "../../library"),
    },
  },
  // Serve ../../library as the static-assets root so /sfx/pop.wav etc. resolve.
  publicDir: path.resolve(HERE, "../../library"),
});
