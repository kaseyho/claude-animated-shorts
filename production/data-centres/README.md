# The Cloud Has a Neighbour Problem

Original 65-second vertical animated explainer about community pushback against rapid data-centre expansion.

- Scene code: `src/videos/data-centres/`.
- Composition: `DataCentres`, registered alongside `BridgeShort`.
- Evidence and visual plan: `SCRIPT.md`.
- Exact narration: `timeline.json`.
- Audio generation and dependencies: `AUDIO.md`.
- Final output: `out/data-centres/the-cloud-has-a-neighbour-problem-2k.mp4`.

From the repository root:

```sh
npm ci
npm run typecheck
npm run render:data-centres
```

Rendering uses the existing `public/data-centres/mix.mp3`. To rebuild the speech/music, follow `AUDIO.md`. The audio script preserves the existing timeline; deliberate retiming requires updating `src/videos/data-centres/story.ts` from the measured `timeline.json` before rendering again.

`node production/data-centres/render-stills.mjs` renders the ten storyboard frames of the latest natural composition. Set `COMPOSITION_ID=DataCentres` for the original version. Optional arguments replace the default frame list.

The figures and neighbourhoods are stylized illustrations. The soundtrack uses synthetic narration and procedurally generated music/SFX. No reference footage or third-party model assets are used.
