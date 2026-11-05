# Claude Animated Shorts

The free Claude skill from the video **"How to Make Viral Animated Shorts Using Claude (Full Workflow)"**, now with a runnable Remotion project.

It makes 55–70 s vertical animated story shorts: 2D characters in a colourful 3D world, with ink outlines, a painted town, lens blur, gliding cameras, a march score and sound effects. Rendering uses three.js inside Remotion on your computer.

The included picture timeline is **The Bridge That Fell for a Song**, a 67.5 s short about the 1831 Broughton bridge.

## Requirements

- **Node.js 22 or newer** and npm.
- **Python 3.10 or newer** for the audio and QA helpers.
- **ffmpeg and ffprobe** on your PATH for audio processing, muxing and video QA.
- **Remotion with `@remotion/three`**. `npm ci` installs the pinned local packages, React, three.js, `@react-three/fiber`, `@react-three/postprocessing`, and `postprocessing`; no global Remotion install is needed.

The first command that renders or lists compositions may download Chrome Headless Shell. It needs internet access and available disk space.

## Quick start

Run these commands from this repository's root:

```sh
npm ci
npm run typecheck
npm run compositions
npm run still
npm run render:smoke
npm start
```

`BridgeShort` should be listed as 1080×1920, 30 fps, 2025 frames. The still is saved to `out/bridge/still.png`; the three-frame smoke render goes to `out/bridge/smoke.mp4`. `npm start` opens Remotion Studio.

Render the full silent picture, or export at 1440×2560:

```sh
npm run render
npm run render -- --scale=1.3333333333333333
```

The full scene is expensive to render. Video scripts default to one concurrent render to limit GPU memory use; increase `--concurrency` if your machine can handle it.

## Data-centre example: expressive narration and occasional hooks

The fork includes an original data-centre explainer alongside the bridge template. Its latest version uses a conversational synthetic narrator at native speed and pitch, with scene timings following the speech. Short outlined text phrases punctuate selected story beats, with keyword emphasis timed to the narration and a qualified electricity statistic.

The [text research and edit specification](docs/shorts-text-research.md) examines seven popular Shorts from three creators, with primary links, observed frames, timing notes and the reasoning behind this treatment.

The [background research and production specification](docs/shorts-background-research.md) examines ten animated Shorts. The latest render replaces the isolated platforms with connected streets, layered neighbourhoods, supporting residents and traffic, construction/service detail, a server hall and a civic meeting room. Background animation is deterministic and all scenery is generated locally.

```sh
npm run render:data-centres:natural
```

This renders `DataCentresNatural` as a 72.2-second 1440×2560 video to `out/data-centres/why-neighbours-are-fighting-the-ai-boom-populated-world-2k.mp4`. The ready-to-render synthetic soundtrack is bundled as `public/data-centres-natural/mix.mp3`. No speech-service account or API key is needed to render it.

- Edit phrases, narration anchors and placement in `src/videos/data-centres/hook-cues.ts`; typography and motion live in `HookOverlays.tsx`. The word anchors use `production/data-centres-natural/words.json` and fail clearly if an edited script no longer matches.
- The bundled Barlow Condensed font loads before rendering. Its license is in `public/fonts/`.
- Edit reusable streets, buildings, supporting actors and scene-specific set dressing in `src/videos/data-centres/environment.ts`. Main story objects and camera moves remain in `world.ts`. Review the full shot when moving props; the portrait cameras can hide objects that look nearby in world coordinates.
- Disable the overlays with `npm run render:data-centres:natural -- --props='{"hooks":false}'` (POSIX shells), or supply a JSON props file on other shells.
- Keep forecast qualifications on screen: the electricity hook explicitly identifies the IEA projection and years.
- For narration changes and evidence, see `production/data-centres-natural/README.md` and `production/data-centres/SCRIPT.md`.
- Earlier original and energetic variants remain available for comparison, using the corresponding render scripts. The natural variant is recommended; it avoids speech time compression.

Python audio builders generate WAV masters plus compact MP3 playback assets. Generated WAVs, caches, output videos and personal recordings are excluded from Git. The bundled narration is synthetic; no personal voice recording is included.

## Entry points and sandboxes

- `src/index.ts` calls `registerRoot()` and imports `src/Root.tsx`.
- `src/Root.tsx` contains the root component; add compositions here.
- `templates/bridge/Main.tsx` exports `BridgeComposition`, the composition definition.
- `templates/bridge/Bridge.tsx` exports `BridgeShort`, the actual animation and postprocessing pipeline.
- `templates/sandbox_index_example.tsx` is an alternative entry that imports the included bridge directly. Run it with `npm run studio:sandbox`.

**Use one entry per bundle.** Never import an entry file into `Root.tsx`, `Main.tsx`, or an animation component. Keep `registerRoot()` outside files defining React components so hot refresh does not call it again ([Remotion guidance](https://www.remotion.dev/docs/register-root)). An existing Remotion project should import `BridgeComposition` into its existing root and keep its existing registration.

For an isolated sandbox, copy `templates/bridge/` to `templates/bridge_world/`, copy the sandbox entry to another file in `templates/`, and change that new entry's import to `./bridge_world/Main`. The shipped example needs no extra folder. If you relocate it elsewhere, adjust the relative import accordingly.

Render several stills with one bundle:

```sh
npm run stills -- out/bridge/x_ 100,400 0.5
```

Optional environment variables for the stills helper:

| Variable | Purpose |
|---|---|
| `BRIDGE_ENTRY` | Alternative entry path, relative to the current directory |
| `REMOTION_BROWSER_EXECUTABLE` | Custom Chrome executable; otherwise Remotion manages its browser |
| `REMOTION_GL` | Override the GL backend, e.g. `angle` or `swangle` |
| `REMOTION_TMP` | Temporary directory on a drive with enough space |

For example, in a POSIX shell:

```sh
BRIDGE_ENTRY=templates/sandbox_index_example.tsx npm run stills -- out/bridge/sandbox_ 100 0.5
```

In PowerShell, set `$env:BRIDGE_ENTRY = 'templates/sandbox_index_example.tsx'` before running `npm run stills`. The helper creates output directories and removes its own temporary bundle when it finishes.

## Assets and sound

A fresh clone renders the procedural bridge, town, vegetation and characters. Optional Kenney GLB props and the original narration/audio are **not included**. Missing optional props are skipped without requests; add your own models under `public/bridge/kenney/` using the names listed in `templates/bridge/world.ts`. Restart Studio after adding assets. A present but invalid model fails with its loading error instead of leaving the render waiting indefinitely.

The starter renders silent picture. For sound, create a Python virtual environment and install the helper dependencies:

```sh
python3 -m venv .venv
# macOS/Linux:
source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Copy `templates/audio/` to your short's `audio/` folder, and supply a sibling `voice/voice.wav` (48 kHz) and `voice/words.json` (a list of word objects with `s` and `e` times in seconds). Run `python audio/mix.py` from that short's folder. The bridge timing is already in `timeline.py`; retime it for a new story. The generated mix is `audio/mix.wav`.

Mux your mix explicitly with the picture:

```sh
ffmpeg -i out/bridge/video.mp4 -i /path/to/your/short/audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -shortest out/bridge/final.mp4
python templates/scripts/bridge_shots.py
python templates/scripts/short_qa.py out/bridge/final.mp4 out/bridge/qa out/bridge/shots.json
```

`bridge_shots.py` also accepts a story path and output JSON path. The advanced `bridge_merge.py` helper is for an existing project's isolated look sandboxes; configure its `ROOT` and create those sandbox folders before using it.

## Use as a Claude skill

Copy this folder to `~/.claude/skills/cartoon-3d-short/`, then say: *"Use the cartoon short skill and make a short about …"*. `SKILL.md` describes the production workflow. Its `src/videos/<name>/` paths refer to a new short copied into your own project; this starter uses `templates/bridge/` directly.

## What's inside

| Path | What it is |
|---|---|
| `package.json`, `package-lock.json` | Pinned, reproducible JavaScript setup and runnable commands |
| `src/` | Remotion entry and root |
| `SKILL.md` | Production pipeline and look values |
| `templates/bridge/` | Composition, world, characters, ink, lens blur, grade, story/camera |
| `templates/audio/` | Synthesized SFX, march music and voice-driven mix |
| `templates/scripts/` | Stills, side-by-side sheets, shot metadata, merge and QA helpers |
| `references/STYLE_BIBLE.md` | Script and visual formula measured from 20 reference shorts |
| `references/reports/` | Motion, depth, textures, characters, lighting, outlines and grade reports |
| `references/frames/`, `references/sheets/` | Reference images for style study |

## Troubleshooting

- **Duplicate `registerRoot()`**: use either the main entry or a sandbox entry, never import both. Put components in separate files from registration, then restart Studio after fixing the entry graph.
- **Missing packages / peer dependency errors**: use `npm ci` with the committed lockfile. Keep all Remotion packages at the same exact version. The shader customizations depend on the pinned three.js version, so test upgrades with a still render.
- **WebGL issues**: try `npm run still -- --gl=swangle`; the stills helper accepts `REMOTION_GL=swangle`. For a custom browser, the CLI accepts `--browser-executable=/path/to/chrome`.
- **Disk space**: bundles copy `public/` into a temporary folder. Large asset collections need room; the supplied empty asset folder does not require the original production's 1.3 GB asset library.

## License

The code and docs are MIT (see `LICENSE`). The reference frames are included for style study only. See [Remotion's licensing terms](https://www.remotion.dev/license) for its separate requirements.
