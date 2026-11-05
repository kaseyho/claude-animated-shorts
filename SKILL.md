---
name: cartoon-3d-short
description: Make an original vertical cartoon story short in the "2D characters in a colourful 3D world" style, rendered with three.js inside Remotion. Build an evidence-backed promise, causal story and payoff, then time the animation and captions to natural narration. The bridge example supplies a reusable visual style, not a required duration or speech rate. Use for another video "like the bridge video", "like the soldiers/bridge short", "in that cartoon 3D style", or a history/science story short with cartoon characters in 3D.
---

# Cartoon 3D story short (three.js + Remotion)

## Runnable starter setup

This repository is also a standalone Remotion project. From its root, run `npm ci`,
`npm run typecheck`, `npm run still`, then `npm start`. Node 22+, Python 3.10+,
ffmpeg and ffprobe are required for the complete workflow; Python dependencies are
in `requirements.txt`. See `README.md` for setup, rendering and audio commands.

The starter's entry is `src/index.ts`, its root is `src/Root.tsx`, and its bridge
composition lives in `templates/bridge/Main.tsx`. The `src/videos/bridge/` paths
below describe copying the template into a production project, not an existing
folder in this checkout. The included sandbox entry runs directly against
`templates/bridge/Main.tsx`; an isolated copy must be created before changing its import.
Only the selected entry calls `registerRoot()`. Never put registration in a React
component file or import another entry from a root/component; this avoids duplicate
registration during hot refresh. Import `BridgeComposition` into an existing root.

Optional GLB props and narration are not included. The procedural scene renders
without them; supply your own audio before mixing. Keep the locked package versions
together: the postprocessing shaders depend on the pinned three.js implementation.

Rendered example: **The Bridge That Fell for a Song**. It is an original 67 s short about the 1831 Broughton bridge and 74 soldiers marching in step; rendering success is not an audience-performance result.
- Code: `templates/bridge/` (composition `BridgeShort`, 1080x1920, 30 fps).
- Script: `templates/SCRIPT_example.md`. The historical audio workspace `~/bridge-short/` is not a repository dependency; use `production/<project>/` for new work.
- Style research: `references/`.

The style reference is a channel studied privately (`references/`: STYLE_BIBLE.md, reports/*.md, frames/).
- Those videos are private study material. Never upload, publish or send them.
- Never copy their scripts, characters or shots. Story, characters and voice are always OUR OWN.
- Never say the channel's name in a voice-over or description.

## Current production rules

Start with the [Shorts playbook](docs/shorts-playbook.md), [brief](templates/SHORTS_BRIEF.md) and [beat sheet](templates/SHORTS_BEAT_SHEET.md). Learn a reference's storytelling and editing mechanism, then apply it to our own subject and evidence. Record observations separately from retention hypotheses.

- The data-centre example uses full, verbatim script subtitles synchronized to the voice. The latest requested treatment is punchier: short one- or two-line phrases, large bold text on a compact dark box, yellow emphasis following the spoken word, and a brief deterministic entrance. Preserve wording, punctuation, names and forecast qualifications. Edit `production/data-centres-natural/subtitle-phrases.json`, run `npm run subtitles:data-centres`, and keep the generated JSON and SRT together. Typography lives in `src/videos/data-centres/Subtitles.tsx`; disable with `{ "subtitles": false }`. See `production/data-centres-natural/SUBTITLES.md` and the primary-source observations in `docs/shorts-boxed-caption-research.md`.
- English only.
- For inhabited settings, build a continuous place beyond the hero: connected ground, relevant midground activity, and quieter distant structures. Match detail to the story beat; a mechanism insert may stay simpler. Check actual camera projections and start/middle/end renders before counting background props as visible. Avoid synchronized crowd motion, stranded shadows, and set dressing that implies unsupported factual harms. See `docs/shorts-background-research.md` and the procedural `src/videos/data-centres/environment.ts` example.
- Avoid collapsing detailed models along one axis: near-coplanar roof/fan faces can flicker even when lights are constant. Hide waiting models and reveal them without flattening; fit the camera near/far range to the scene. Check consecutive full-resolution crops, since whole-frame QA can miss local z-fighting. Keep time-of-day changes intentional and motivated. See `docs/data-centres-lighting-fix.md`.
- Voice: natural, expressive conversational delivery. Preserve native speech timing and pitch; do not speed up or pitch-shift narration to simulate enthusiasm. Retiming the animation is preferable to compressing speech.
- Jokes are researched real facts.
- Mix for intelligible narration and purposeful contrast. Preserve an existing approved soundtrack during visual revisions; use its production notes for gain and loudness settings instead of applying a universal music boost.
- Final export 2K vertical: 1440x2560, `--scale 1.3333`.
- Use the available render/QA tools and an independent review where practical. Record what was checked and its limits; no specific model is required.
- Save after every step.
- "Just do it" once the script is approved.

## Pipeline
1. **Promise and evidence.** Copy the brief into `production/<project>/`. Define the intended viewer, one question and the answer the film will deliver. Collect sources and qualifications for both spoken claims and implied visual claims. Study relevant creator examples with links and sampled times; public views alone do not explain their success.
2. **Original script and causal beats.** Draft three opening image/line pairs, select one, and complete the beat sheet. Each beat must add action, evidence, consequence or useful context. Resolve the opening promise before an optional callback or loop. The bridge's escalating accident and joke are one example, not a mandatory story formula. Use concise language and let the picture supply information it can communicate clearly.
3. **Natural voice and measured timing.** Record or generate the chosen script at its intended expressive delivery. Save the waveform and word timings in the production folder, check the alignment, then derive scene duration from that take. Do not force a fixed word rate or shorten a clear take by accelerating speech. A script or voice change requires updating dependent scene boundaries, captions/SRT and sound cues together.
4. **Composition and picture.** Reuse the appropriate existing scene system; for the bridge look, copy `templates/bridge/` to `src/videos/<name>/` and register a new composition in `src/Root.tsx`. Keep `registerRoot()` in the entry only. Plan cuts, reframes, holds, character actions and supporting scenery around changes in information. Flashes, shakes, glides and reaction leads are optional choices, not a fixed cadence. Give important evidence and payoffs time to register. Calculate movement from frame time so out-of-order rendering is deterministic.
5. **Captions, world and sound.** Generate exact-script subtitles from the final word timings; review short phrase breaks and player-safe placement. Build only the background detail the place and story need. Keep lighting coherent and surfaces separated. Use original/licensed sound cues and a score beneath the voice, with contrast where it serves the action. The data-centre builders and production notes provide a current worked pipeline; the bridge values below provide a separate visual preset.
6. **Preview and revise.** Run `npm run typecheck`. For the bridge, use `npm run stills -- out/<name>/x_ 100,400 0.5`; `BRIDGE_ENTRY` selects an alternative entry containing `BridgeShort`. For other composition IDs, use the Remotion CLI or the relevant project helper. Review opening, turns, payoff, long captions and camera extremes at phone size, then inspect short moving clips and consecutive crops of small surfaces. `python templates/scripts/sbs_sheet.py out.jpg --ours ... --ref ...` makes comparison sheets. Record concrete defects and recheck fixes.
7. **Render and verify.** Use the project's render script or `npx remotion render src/index.ts <Comp> out/<name>/video.mp4 --codec h264 --crf 16 --scale 1.3333333333333333`. Compositions with an `Audio` component already render their soundtrack. Mux an external master only when that workflow is intended, explicitly selecting video from input 0 and audio from input 1. Run `python templates/scripts/short_qa.py final.mp4 out/<name>/qa shots.json` in the configured Python environment. Classify planned cuts/text changes and intentional holds; supplement whole-frame statistics with localized checks rather than adding motion merely to pass a detector.
8. **Deliver and learn.** Link the verified output and save sources, decisions, reproduction steps and verification limits in the repository's production notes. Commit/push within the authorized task scope. Update personal memory only when explicitly requested. After publication, use the [measurement guide](docs/research/shorts-measurement.md) to inspect the specific retention hypothesis; do not call an untested edit proven or viral.

## Historical bridge look values (all in `templates/bridge/`)
These values record the bridge's visual matching exercise, not universal retention rules. To reuse that look,
copy the template and adapt story.ts / build.ts / cast.ts. Historical review scores at the end: colour day 7, golden 5-6,
lighting 5-6, ink 6, textures 5-6, characters 7, depth 6-7, composition 6-7 (from 5/3/4/5/4/7/4/6 at the start).
- **Light presets** (`lights.ts`, sun camera-relative and frozen per shot):
  - day: az 75 / el 48, lit [1.58,1.5,1.33], shade [.30,.29,.36], lift [.05,.06,.11] (cool tint ONLY in shade), sky
    top #3e7fd2 → horizon #b8d0ec, fog = horizon, 25→300 m, uSat 1.08, ~15 % blue haze past 60 m.
  - golden: az 6 / el 7 (backlit low sun), key toward #FFB36B ×1.5, violet-blue shade (facade ≈ #444380), sky
    #ffc47c → #8a6f8a, peach fog only past 50 m, sun disc #ffcf9e + bloom, contact blobs + real card shadows.
- **Albedos** (`paint.ts`/`build.ts`): muted brick / cream / ochre / terracotta houses with plinth, cornice, sills,
  hoods, door step, chimney + pot, heights 7 / 8.4 / 9.8 m; warm grey/beige stone (saturation −35 % from "storybook");
  ochre wood deck C* ~51-58 with near-black seams; iron dark and desaturated. Never lemon, never lavender lit faces.
- **Ink** (`ink.ts`): #030303, 5.1 px near (6 m) → 3.3 px far (90 m) at 1080x1920, creases ×0.8 from 35°, depth
  jumps from 1 %, fog tint 0.3 only far; character cards on layer `NOINK` (they carry their own plum ink).
- **Lens** (`lensblur.ts` + `dofAt` in story.ts): cInf px at 1080: hook/river CU 15-16, close-ups 12-14, MS 10-12,
  park 7, golden sway 5, wides/aerials 0. Focus on the eyes of the front row.
- **Post** (`Bridge.tsx`): ink → lens pre → lens main → bloom (thr 1.0, int .5, 6 levels, radius .6) → NEUTRAL tone
  map → grade; MSAA 4. Film grain exists but is OFF (reference measures no grain; it quadruples the file size).
- **Characters** (`toon.ts`/`cast.ts`/`cardshade.ts`): bean heads h/w .94, plum ink #241726, eyes .26 W apart, no blush,
  14 expressions; adults 3.5 head-heights; walk bob 5 %, lean 1-7°, planted 0.8 m stride; blinks 0.5-2.3 s; tight
  contact shadow ~.5 under the feet + sun-direction tail by day; golden rim inner only (never an offset outer copy).
- **Camera** (`story.ts`): the bridge used cuts on big jumps, smootherstep glides 18-40 f and creeping holds (no static hold ≥4 f),
  flip kicks decaying over 7 f on impacts, 4-4.6° rolls, foreground props (`FOREGROUND`) in ~1/3 of shots.

## Historical look targets (reference study; see references/reports/)

These are observations and targets from the bridge style study. Choose motion and hold duration for the current story; the following camera figures are not required on every new short.
- **Ink:**
  - World lines: about 3 px at 1080 wide, near-black #0b0a0c, nearly constant with distance. Silhouettes, depth jumps and normal creases only. No line on wall/floor joins or the horizon. Character cards are never outlined by the world ink.
  - Character ink: dark plum #201628-#2f1d28, thicker on the bottom/shadow side.
- **Colour:**
  - Day median luma ~.57. Non-ink p5 ~.23 (no crushed blacks). Lit chroma C* p90 ~55. Day sky top ~#5e93d9, horizon 1.28x brighter.
  - Golden: peach horizon #ffd08a, violet-blue shadows (never brown), backlit sun.
- **Depth:**
  - DOF on about 1/3 of screen time (CU, MS, inserts), cInf 10-16 px at 1080, focus on the eyes. Establishing and wide shots stay sharp.
  - Fog = horizon colour, 25→420 m day, 20→360 m golden.
  - Bloom only on HDR emissives: threshold 1.0.
- **Camera:**
  - Hard cuts on big jumps. Everything else is a smootherstep glide of 18-40 f, peak ≤ 25 px/f at 720p.
  - The bridge's holds pushed in 0.15-0.35 %/f, with 0.6 %/f on punch words.
  - Rolls of 4-5°.
  - No hand-held float. Impact shakes flip sign every frame and decay over 7 f.
- **Characters:**
  - About 3.5 head-heights tall, legs 1.4 HH.
  - Stick limbs about 0.055 of head width, ink-dot hands.
  - Bean head (h/w ~0.93, narrower chin, pointier crown).
  - No blush or eye highlights. Faces at brightness ~.93.
  - Walk bob 3-7 %, lean 1-7°, planted feet.
  - Blinks every 0.5-2.3 s, lasting 4 f.

## Optional look-match loop (adapted from the bridge production)
1. **Measure the reference first.** Record sampled observations for motion, depth, textures, characters, lighting, outlines and grade in `references/reports/<topic>.md`; parallelize independent areas when useful. The historical shared brief is `references/reports/CONTEXT.md`. Mark estimates and sampled limits instead of inventing exact measurements.
2. **Sandboxes, one owner per file.** Copy the project folder to `src/videos/<name>_{cam,world,mat,char,post}` with entries `src/sandboxes/<n>/index.tsx` (same `index.tsx` as main, only the import path changed). Ownership used for the bridge:
   - cam: story.ts (camera keys, cuts, kicks, DOF table, foreground props)
   - world: world.ts, lights.ts, shade.ts, grade.ts (sun, sky, fog, river, colour, grade)
   - mat: paint.ts, build.ts (painted textures, buildings, props)
   - char: toon.ts, cast.ts, cardshade.ts (character drawing, posing, card lighting, fx cards)
   - post: ink.ts, Bridge.tsx, lensblur.ts (outline pass, composer, lens blur, bloom)
   Agents only edit their owned files. A sandbox entry containing `BridgeShort` can render stills with `BRIDGE_ENTRY=src/sandboxes/<n>/index.tsx node templates/scripts/bridge-stills.mjs out/<name>/<n>/x_ <frames> 0.5`.
3. **Integrate** reviewed owned-file changes, preserve unrelated work and run `npm run typecheck`. The historical `templates/scripts/bridge_merge.py` is a configurable example with a placeholder `ROOT`, not a ready-to-run repository command. If using it, first set its project path and ownership map deliberately; otherwise integrate through the normal Git diff. Refresh sandbox copies only after checking for unmerged work.
4. **Verify** with an independent reviewer where practical: use `python templates/scripts/sbs_sheet.py out.jpg --ours a b --ref r1 r2`, inspect the rendered motion as well as stills, and record concrete defects with frame numbers. Route each fix to its owner and recheck the affected output. The historical bridge's numeric look scores are subjective visual-review notes, not viewer-retention evidence.
5. Contracts between owners live in exported constants (e.g. `NOINK` layer from ink.ts, `dofAt`/`FOREGROUND` from story.ts, `LIGHTS`/`LOOK` from lights.ts). Changing a contract means telling every owner that reads it.

## Gotchas
- Kenney nature-kit materials are teal: recolour them by material name in build.ts.
- Cameras end up inside houses: the sight-line culler in build.ts/world.ts removes anything blocking any camera ray.
- Ink in the same merged effect pass as DOF gets overwritten. Ink must be its own pass before the blur.
- Pixel-sized post parameters must scale with resolution: stills are at 0.5, the final at 1.333. R3F clamps dpr to ≥ 1, so `--scale 0.5` stills still render a 1080x1920 buffer.
- **Disk:** older bridge iterations accumulated large temporary bundles. The current `templates/scripts/bridge-stills.mjs` removes the bundle it created in a `finally` block and accepts `REMOTION_TMP` for a chosen temporary location. Check available space before long batches and clean only identified task-owned intermediates after rendering stops; do not sweep shared temporary folders blindly.
- In JS strings write `"<big drive>/remotion-tmp"`, never `"<big drive>\remotion-tmp"` (`\r` becomes a carriage return).
- Check the composition's audio before muxing: the bridge starter is silent, while the data-centre compositions include their soundtrack through `Audio`.
- Give collaborating agents distinct file ownership and ask them to save concise evidence/verification notes in the production folder. Do not assume a model or tool name from the historical workflow is available.
- The current TypeScript configuration includes `src` and TypeScript files under `templates`. Keep disposable experiments outside those source paths unless they should be checked.
- Render speed depends on the scene, GPU, scale and concurrency. The older bridge's ~4 fps render and 3–8 s still measurements are historical observations, not estimates for every project.
- The bridge's 2.5% grain experiment increased the 2K file from roughly 250 MB to 910 MB. Keep grain off unless it serves the current brief, and inspect compression rather than assuming added texture improves the result.

## Readability traps the verifier caught (check every new prop/shot for these)
- **A swing drawn as one rope that disappears behind the kid reads as a HANGING.** Always two ropes to a wide plank
  with the kid between them (`swingKid` in toon.ts), and a frame whose legs clear the arc (A-frame at each end).
- Props or flotsam closer than ~2 m to a lens become huge cut-off blobs at the frame edge. When a camera moves, re-check
  every prop near its new position (the river cameras moved into the floating hats).
- A foreground bush cut by the frame edge reads as a "green ball"; a foreground prop must be recognisable or gone.
- Flags: red + yellow star/diamond reads as Vietnam's. Use a period-correct flag (St George's cross for England 1831).
- Painted signs lit by a side sun go grey-blue and unreadable: give the sign face an unlit material.
- Golden rim light done as an offset outer copy turns every hat into a picture frame: inner rim only, head/torso only.
- Balcony/railing rails at chest height through characters: put the lens ~2.5 m up so rails cross legs, not torsos.
- A deliberate static hold can trigger the QA frozen-span detector (≥12 frames). Classify it against the shot's intent and inspect the result; preserve useful reading or reaction time instead of adding camera creep just to silence the flag.
