import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const HERE = import.meta.dirname;
// apps/excalidraw-editor → repo root is ../.. — then library/diagrams/
const DIAGRAMS_DIR = path.resolve(HERE, "../../library/diagrams/source");
const RENDERED_DIR = path.resolve(HERE, "../../library/diagrams");

if (!existsSync(DIAGRAMS_DIR)) mkdirSync(DIAGRAMS_DIR, { recursive: true });

/**
 * Dev-only middleware: list, load, and save .excalidraw files to
 * public/diagrams/source/ so the browser-embedded Excalidraw can persist
 * back to the project.
 */
const diagramsApi = () => ({
  name: "diagrams-api",
  configureServer(server: {
    middlewares: {
      use: (
        path: string,
        handler: (
          req: { url?: string; method?: string; on: (event: string, cb: (chunk: unknown) => void) => void },
          res: {
            statusCode: number;
            setHeader: (k: string, v: string) => void;
            end: (body?: string) => void;
          },
        ) => void,
      ) => void;
    };
  }) {
    // List files
    server.middlewares.use("/api/diagrams", (req, res) => {
      if (req.method !== "GET") {
        res.statusCode = 405;
        return res.end();
      }
      const files = readdirSync(DIAGRAMS_DIR)
        .filter((f) => f.endsWith(".excalidraw"))
        .map((f) => ({
          name: f,
          size: readFileSync(path.join(DIAGRAMS_DIR, f)).length,
        }));
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(files));
    });

    // Load a specific file
    server.middlewares.use("/api/diagram", (req, res) => {
      const url = new URL(req.url ?? "", "http://x");
      const name = url.searchParams.get("name");
      if (!name || name.includes("/") || name.includes("..")) {
        res.statusCode = 400;
        return res.end("bad name");
      }
      if (req.method === "GET") {
        const filePath = path.join(DIAGRAMS_DIR, name);
        if (!existsSync(filePath)) {
          res.statusCode = 404;
          return res.end("not found");
        }
        res.setHeader("Content-Type", "application/json");
        return res.end(readFileSync(filePath, "utf8"));
      }
      if (req.method === "POST" || req.method === "PUT") {
        let body = "";
        req.on("data", (chunk) => {
          body += String(chunk);
        });
        req.on("end", () => {
          try {
            JSON.parse(body); // validate
            writeFileSync(path.join(DIAGRAMS_DIR, name), body);
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true, path: `library/diagrams/source/${name}` }));
          } catch {
            res.statusCode = 400;
            res.end("invalid JSON");
          }
        });
        return;
      }
      res.statusCode = 405;
      res.end();
    });

    // Static serve rendered SVGs for preview
    server.middlewares.use("/rendered", (req, res) => {
      const url = new URL(req.url ?? "", "http://x");
      const name = url.pathname.slice(1);
      if (!name.endsWith(".svg") || name.includes("..")) {
        res.statusCode = 400;
        return res.end();
      }
      const filePath = path.join(RENDERED_DIR, name);
      if (!existsSync(filePath)) {
        res.statusCode = 404;
        return res.end();
      }
      res.setHeader("Content-Type", "image/svg+xml");
      res.end(readFileSync(filePath, "utf8"));
    });
  },
});

export default defineConfig({
  root: HERE,
  // Isolate dep cache from the slides app so `dev:all` doesn't cause the two
  // Vite instances to overwrite each other's pre-bundled deps.
  cacheDir: path.resolve(HERE, "node_modules/.vite"),
  // host: true → binds to 0.0.0.0 (IPv4) + :: (IPv6). Fixes the case where
  // Vite would bind IPv6-only and http://127.0.0.1:3040 would refuse.
  server: { port: 3040, host: true, open: false, strictPort: true },
  plugins: [react(), diagramsApi()],
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client", "@excalidraw/excalidraw"],
  },
});
