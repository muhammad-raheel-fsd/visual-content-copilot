import { Excalidraw } from "@excalidraw/excalidraw";
import { useCallback, useEffect, useState } from "react";

type FileInfo = { name: string; size: number };

export function App() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [scene, setScene] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(null);

  const refreshList = useCallback(async () => {
    const res = await fetch("/api/diagrams");
    setFiles(await res.json());
  }, []);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const openFile = useCallback(async (name: string) => {
    const res = await fetch(`/api/diagram?name=${encodeURIComponent(name)}`);
    if (!res.ok) {
      setStatus(`load failed: ${res.status}`);
      return;
    }
    const data = await res.json();
    setScene(data);
    setCurrentFile(name);
    setStatus(`loaded ${name}`);
    if (api) {
      api.updateScene({
        elements: data.elements ?? [],
        appState: data.appState ?? {},
      });
    }
  }, [api]);

  const saveCurrent = useCallback(async () => {
    if (!api || !currentFile) {
      setStatus("nothing to save");
      return;
    }
    const elements = api.getSceneElements();
    const appState = api.getAppState();
    const payload = {
      type: "excalidraw",
      version: 2,
      source: "https://excalidraw.com",
      elements,
      appState: {
        gridSize: appState.gridSize ?? null,
        viewBackgroundColor: appState.viewBackgroundColor ?? "#0d1117",
      },
      files: {},
    };
    const res = await fetch(`/api/diagram?name=${encodeURIComponent(currentFile)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload, null, 2),
    });
    if (res.ok) {
      const j = await res.json();
      setStatus(`saved → ${j.path} · run npm run render:diagrams to update SVG`);
      refreshList();
    } else {
      setStatus(`save failed: ${res.status}`);
    }
  }, [api, currentFile, refreshList]);

  const createNew = useCallback(async () => {
    const name = prompt("New diagram name (no .excalidraw suffix):");
    if (!name) return;
    const safeName = name.replace(/[^a-z0-9-_]/gi, "-").toLowerCase() + ".excalidraw";
    const payload = {
      type: "excalidraw",
      version: 2,
      source: "https://excalidraw.com",
      elements: [],
      appState: {
        gridSize: null,
        viewBackgroundColor: "#0d1117",
      },
      files: {},
    };
    const res = await fetch(`/api/diagram?name=${encodeURIComponent(safeName)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload, null, 2),
    });
    if (res.ok) {
      await refreshList();
      await openFile(safeName);
    }
  }, [openFile, refreshList]);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <aside
        style={{
          width: 280,
          padding: 16,
          borderRight: "1px solid #30363d",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700 }}>bytemotion editor</div>
        <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 8 }}>
          public/diagrams/source/
        </div>
        <button onClick={createNew} style={btn}>
          + New diagram
        </button>
        <button onClick={saveCurrent} style={{ ...btn, backgroundColor: "#238636" }} disabled={!currentFile}>
          Save · {currentFile ?? "(no file)"}
        </button>
        <button onClick={refreshList} style={btn}>
          Refresh list
        </button>
        <div style={{ marginTop: 8, fontSize: 12, color: "#8b949e" }}>Files</div>
        {files.map((f) => (
          <button
            key={f.name}
            onClick={() => openFile(f.name)}
            style={{
              ...btn,
              backgroundColor: f.name === currentFile ? "#1f6feb" : "#161b22",
              textAlign: "left",
            }}
          >
            {f.name}
            <div style={{ fontSize: 10, color: "#8b949e" }}>{(f.size / 1024).toFixed(1)} KB</div>
          </button>
        ))}
        {status ? (
          <div
            style={{
              marginTop: "auto",
              padding: 10,
              fontSize: 12,
              color: "#3fb950",
              backgroundColor: "#0d1117",
              borderRadius: 6,
              border: "1px solid #30363d",
              wordBreak: "break-word",
            }}
          >
            {status}
          </div>
        ) : null}
      </aside>
      <div style={{ flex: 1, position: "relative" }}>
        <Excalidraw
          excalidrawAPI={(a) => setApi(a)}
          initialData={scene ?? undefined}
          theme="dark"
        />
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: 13,
  fontFamily: "Inter, system-ui, sans-serif",
  color: "#c9d1d9",
  backgroundColor: "#161b22",
  border: "1px solid #30363d",
  borderRadius: 6,
  cursor: "pointer",
  textAlign: "left",
};
