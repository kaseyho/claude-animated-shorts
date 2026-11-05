# Natural narration revision

The previous energetic version used a news-style voice, a pitch boost, a +15% synthesis rate and approximately 1.57× additional speech time compression. This revision uses the stock conversational voice `en-US-AndrewMultilingualNeural` at its native rate and pitch. The full speech waveform and internal pauses are preserved; there is no time stretching. Scene boundaries are derived from actual speech duration.

The script is shortened to 161 words and rewritten with contractions and connected sentences. The factual claims remain those documented in [the original evidence notes](../data-centres/SCRIPT.md). The IEA electricity figure is a projection, local opposition examples do not represent worldwide unanimity, and resource impacts vary by facility and location.

The music bed is reduced by 3 dB relative to the energetic version and returns to 104 BPM. The final mix targets -16 LUFS with a -1.2 dBTP ceiling. This is synthetic narration, not the user's recording or a voice clone.

## Rebuild

From the repository root:

```sh
.venv/bin/python -m pip install -r production/data-centres-natural/audio-requirements.txt
.venv/bin/python production/data-centres-natural/build_audio.py
npm run render:data-centres:natural
```

Initial speech synthesis requires internet. Exact text, native word timings, scene timings and audio measurements are saved alongside the build script. Regenerate `src/videos/data-centres/natural-story.ts` from `timeline.json` if the script or voice changes before rendering.

## Occasional editorial hooks

`DataCentresNatural` enables five animated top-of-frame headlines: the opening neighbour question, the electricity forecast, who pays for grid upgrades, residents asking for answers, and the closing question. They appear for 3.3–4.1 seconds each and leave most of the film text-free. The forecast retains its IEA attribution and 2025–2030 period on screen.

The configuration lives in `src/videos/data-centres/HookOverlays.tsx`. Cue offsets are relative to scene boundaries, so they follow scene retiming. Input props `{ "hooks": false }` disable the overlays. The latest render command produces `out/data-centres/why-neighbours-are-fighting-the-ai-boom-natural-hooks-2k.mp4`.

The ready-to-render audio is `public/data-centres-natural/mix.mp3`; the builder generates both this compact asset and a local WAV master. Personal recordings and generated WAV intermediates are excluded from the public repository.
