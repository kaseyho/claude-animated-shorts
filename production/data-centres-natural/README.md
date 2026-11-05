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

## Synchronized script subtitles

`DataCentresNatural` now displays the complete spoken script in plain white outlined subtitles. All 161 words, with their original punctuation, are grouped into 33 phrases. Each phrase starts at its first spoken word and ends shortly after its last word, before the next phrase or scene cut. This replaces the previous clickbait text entirely.

The [subtitle specification](SUBTITLES.md) describes the exact timing and layout. Edit phrase and line breaks in `subtitle-phrases.json`, then run `npm run subtitles:data-centres` to generate `subtitles.json` and the standalone `subtitles.srt`. The builder validates every word against `timeline.json` and `words.json`; the render command checks both generated files for drift. Rebuilding audio also regenerates subtitles, and fails if edited phrase text no longer matches the script. `Subtitles.tsx` handles the bundled font and steady lower-frame placement.

Input props `{ "subtitles": false }` disable subtitles. The legacy `{ "hooks": false }` alias remains supported; explicit `subtitles` takes precedence. The render command produces `out/data-centres/why-neighbours-are-fighting-the-ai-boom-subtitled-2k.mp4`. The speech waveform, pitch, playback speed and populated environments are unchanged by this subtitle revision. The [earlier text study](../../docs/shorts-text-research.md) remains a historical research record.

## Populated environments

The [background study](../../docs/shorts-background-research.md) records ten primary video examples, the scene plan and visual review. `environment.ts` adds connected streets, three depths of buildings, supporting residents, traffic and scene-specific infrastructure. The electricity scene uses a server hall and the planning scene uses a civic room. `world.ts` supplies continuous ground, moving character/shadow pairs and the main story objects. No external models or reference footage are needed to render these environments.

The ready-to-render audio is `public/data-centres-natural/mix.mp3`; the builder generates both this compact asset and a local WAV master. Personal recordings and generated WAV intermediates are excluded from the public repository.
