# Audio production

Narration uses the synthetic English voice `en-GB-RyanNeural`, generated through edge-tts. This is a synthetic voice, not a recording or imitation of a named person. The instrumental and sound effects are original procedural synthesis with a fixed seed, no sampled recordings.

Run from the repository root:

```sh
.venv/bin/python -m pip install -r production/data-centres/audio-requirements.txt
.venv/bin/python production/data-centres/build_audio.py
```

Requires ffmpeg and ffprobe. Initial speech generation requires internet; the text-keyed MP3 caches permit repeat offline mixing. Existing `timeline.json` locks scene timing when a line is revised. Remove it only when deliberately retiming all scenes.

Outputs:

- `public/data-centres/mix.wav`: final 65-second, 48 kHz stereo mix, mastered to approximately -16 LUFS, ceiling -1.2 dBTP.
- `public/data-centres/voice.wav`: narration stem.
- `timeline.json`: scene boundaries at 30 fps, narration starts and durations.
- `words.json`: speech-engine word timings, adjusted for time stretching (not human-transcribed alignment).
- `music.wav`, `sfx.wav`: original synthesized stems.
- `audio-report.json`: measured loudness and synthesis metadata.

Music: 104 BPM, F minor, mallet-like plucks, restrained synth pad, sine bass, sparse brushed pulse. The music ducks under the narration. +3 dB music and -6 dB SFX adjustments are applied before final mastering. The overall mastering gain affects all stems together.
