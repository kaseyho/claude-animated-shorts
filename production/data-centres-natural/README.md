# Natural narration revision

The latest [punchier picture and sound pass](PUNCHY_EDIT.md) adds active environments, reaction changes and speech-timed close-ups while retaining this narration. For a possible future script revision, see the [proposed retention blueprint](RETENTION_BLUEPRINT.md) and [Shorts playbook](../../docs/shorts-playbook.md). The blueprint documents original opening options, causal beats and all dependent timing files; it has not been applied to this version's narration or render.

The previous energetic version used a news-style voice, a pitch boost, a +15% synthesis rate and approximately 1.57× additional speech time compression. This revision uses the stock conversational voice `en-US-AndrewMultilingualNeural` at its native rate and pitch. The full speech waveform and internal pauses are preserved; there is no time stretching. Scene boundaries are derived from actual speech duration.

The script is shortened to 161 words and rewritten with contractions and connected sentences. The factual claims remain those documented in [the original evidence notes](../data-centres/SCRIPT.md). The IEA electricity figure is a projection, local opposition examples do not represent worldwide unanimity, and resource impacts vary by facility and location.

The base natural mix reduced the music bed by 3 dB relative to the energetic version and returned to 104 BPM, targeting -16 LUFS with a -1.2 dBTP ceiling. The latest punchier mix preserves that native voice and original score, adds word-timed accents and dynamic backing levels, and targets -16 LUFS with a -1.5 dBTP ceiling. This is synthetic narration, not the user's recording or a voice clone.

## Rebuild

From the repository root:

```sh
.venv/bin/python -m pip install -r production/data-centres-natural/audio-requirements.txt
.venv/bin/python production/data-centres-natural/build_audio.py
.venv/bin/python production/data-centres-natural/punchy_audio.py
npm run render:data-centres:natural
```

Initial speech synthesis requires internet. Exact text, native word timings, scene timings and audio measurements are saved alongside the build script. Regenerate `src/videos/data-centres/natural-story.ts` from `timeline.json` if the script or voice changes before rendering.

## Synchronized script subtitles

`DataCentresNatural` displays the complete spoken script in punchier boxed subtitles. All 161 words, with their original punctuation, are grouped into 50 phrases. Each phrase starts at its first spoken word and ends shortly after its last word, before the next phrase or scene cut. Larger white type sits on a compact dark backing, with a yellow highlight following the spoken word and a six-frame settle. The [refreshed study](../../docs/shorts-boxed-caption-research.md) records the creator references and design decisions.

The [subtitle specification](SUBTITLES.md) describes the exact timing and layout. Edit phrase and line breaks in `subtitle-phrases.json`, then run `npm run subtitles:data-centres` to generate `subtitles.json` and the standalone `subtitles.srt`. The builder validates every word against `timeline.json` and `words.json`; the render command checks both generated files for drift. Rebuilding audio also regenerates subtitles, and fails if edited phrase text no longer matches the script. `Subtitles.tsx` handles the bundled font and steady lower-frame placement.

Input props `{ "subtitles": false }` disable subtitles. The legacy `{ "hooks": false }` alias remains supported; explicit `subtitles` takes precedence. The render command produces `out/data-centres/why-neighbours-are-fighting-the-ai-boom-punchy-2k.mp4`. The speech waveform, pitch and playback speed are unchanged. The [earlier text study](../../docs/shorts-text-research.md) remains a historical research record.

## Populated environments

The [background study](../../docs/shorts-background-research.md) records ten primary video examples, the scene plan and visual review. `environment.ts` adds connected streets, three depths of buildings, supporting residents, traffic and scene-specific infrastructure. The electricity scene uses a server hall and the planning scene uses a civic room. `world.ts` supplies continuous ground, moving character/shadow pairs and the main story objects. No external models or reference footage are needed to render these environments.

The [lighting troubleshooting guide](../../docs/data-centres-lighting-fix.md) documents the corrected roof flicker, camera depth precision and daytime continuity. When changing geometry or cameras, inspect consecutive full-resolution crops of small surfaces as well as the overall picture.

The current ready-to-render audio is `public/data-centres-natural/punchy-mix.mp3`. The base builder writes `mix.mp3` and local voice/music masters; `punchy_audio.py` reuses those masters for the new word-timed backing mix. Both bundled MP3s remain available. Personal recordings and generated WAV intermediates are excluded from the public repository.
