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

`DataCentresNatural` uses occasional outlined text phrases rather than headline cards. The opening moves through “Harmless?”, “Next door.” and “It's personal.” Subsequent bursts highlight the electricity forecast, costs, noise, residents' demands, consultation before building and the closing question. Most of the film remains text-free. The large approximate multiplier retains its data-centre electricity label, IEA projection attribution and 2025–2030 period for the entire time it appears.

The [research document](../../docs/shorts-text-research.md) contains seven primary examples and a timed edit plan. Phrase content, word anchors and shot-specific positions live in `src/videos/data-centres/hook-cues.ts`. `HookOverlays.tsx` handles the bundled font, outlined letters and short emphasis animation. Most starts and emphasis points resolve against this folder's `words.json`; scene-ending boundaries use `natural-story.ts`. Keep both timing files synchronized when rebuilding narration. Missing or ambiguous phrase anchors stop rendering with an explicit error.

Input props `{ "hooks": false }` disable the overlays. The render command produces `out/data-centres/why-neighbours-are-fighting-the-ai-boom-populated-world-2k.mp4`. The speech waveform, pitch and playback speed are unchanged by the visual revisions.

## Populated environments

The [background study](../../docs/shorts-background-research.md) records ten primary video examples, the scene plan and visual review. `environment.ts` adds connected streets, three depths of buildings, supporting residents, traffic and scene-specific infrastructure. The electricity scene uses a server hall and the planning scene uses a civic room. `world.ts` supplies continuous ground, moving character/shadow pairs and the main story objects. No external models or reference footage are needed to render these environments.

The ready-to-render audio is `public/data-centres-natural/mix.mp3`; the builder generates both this compact asset and a local WAV master. Personal recordings and generated WAV intermediates are excluded from the public repository.
