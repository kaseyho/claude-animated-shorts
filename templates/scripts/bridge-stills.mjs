// Usage: npm run stills -- out/bridge/x_ 100,400 0.5
// BRIDGE_ENTRY selects an alternative entry; REMOTION_BROWSER_EXECUTABLE and
// REMOTION_GL optionally override Remotion's browser and GL backend defaults.
import fs from "node:fs";
import path from "node:path";

if (process.env.REMOTION_TMP) {
  fs.mkdirSync(process.env.REMOTION_TMP, { recursive: true });
  process.env.TMPDIR = process.env.TEMP = process.env.TMP = process.env.REMOTION_TMP;
}

const [prefix, frames, scale = "0.5"] = process.argv.slice(2);
if (!prefix || !frames || !frames.split(",").every((f) => /^\d+$/.test(f)) || !Number.isFinite(Number(scale)) || Number(scale) <= 0) {
  console.error("Usage: npm run stills -- <output-prefix> <frames,comma,separated> [positive-scale]");
  process.exit(1);
}

// Import after setting the temporary directory (some dependencies cache it).
const { bundle } = await import("@remotion/bundler");
const { renderStill, selectComposition } = await import("@remotion/renderer");
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || undefined;
const chromiumOptions = process.env.REMOTION_GL ? { gl: process.env.REMOTION_GL } : {};
const serveUrl = await bundle({ entryPoint: path.resolve(process.env.BRIDGE_ENTRY || "src/index.ts"), publicDir: path.resolve("public") });
try {
  const composition = await selectComposition({ serveUrl, id: "BridgeShort", browserExecutable, chromiumOptions });
  const requested = frames.split(",").map(Number);
  if (requested.some((frame) => frame >= composition.durationInFrames)) {
    throw new Error(`Frames must be between 0 and ${composition.durationInFrames - 1}.`);
  }
  fs.mkdirSync(path.dirname(path.resolve(prefix)), { recursive: true });
  const onBrowserLog = (l) => { if (l.type === "error" || l.type === "warning") console.log(`[${l.type}]`, l.text.slice(0, 300)); };
  for (const frame of requested) {
    const t0 = Date.now();
    await renderStill({ composition, serveUrl, frame, output: `${prefix}${frame}.jpg`, imageFormat: "jpeg", jpegQuality: 88, scale: Number(scale),
      browserExecutable, chromiumOptions, timeoutInMilliseconds: 180000, onBrowserLog });
    console.log("still", frame, ((Date.now() - t0) / 1000).toFixed(1) + "s");
  }
} finally {
  // Remove only the temporary bundle created by this invocation.
  fs.rmSync(serveUrl, { recursive: true, force: true });
}
