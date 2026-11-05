# Why neighbours are fighting the AI boom

58-second revision with a sharper opening and a stock US male synthetic narrator (en-US-GuyNeural), faster pacing, emphasis and a 116 BPM original synthesized score. This is an original delivery, not a clone or impersonation of Zack D. Films.

This version uses only stock synthetic narration. No personal voice recording is included.

## Rebuild

From the repository root, install `audio-requirements.txt` in the existing Python environment and run `.venv/bin/python production/data-centres-energetic/build_audio.py`. This needs internet for uncached speech generation and ffmpeg/ffprobe. Then run `npm run render:data-centres:energetic`.

The audio builder preserves timings after the first build. If deliberately retiming, regenerate `src/videos/data-centres/energetic-story.ts` and `shots.json` from `timeline.json` before rendering.

## Script and evidence

`narration.txt` contains the revised script. `timeline.json` contains exact scene/voice timing. `words.json` contains speech-engine timestamps, not human-verified transcription.

Factual sources and boundaries are unchanged from [the original evidence notes](../data-centres/SCRIPT.md): the IEA's 2026 forecast is approximately 485 TWh in 2025 to 950 TWh in 2030; local opposition examples concern Mexico and South Africa; water needs and electricity-price effects vary. No new quantitative claims were added. The opening is a rhetorical hook, not a claim that all neighbours oppose every data centre.
