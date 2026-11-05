import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => JSON.parse(fs.readFileSync(path.join(here, name), 'utf8'));
const timeline = read('timeline.json');
const words = read('words.json');
const phrases = read('subtitle-phrases.json');
const normalize = (word) => word.toLowerCase().replaceAll('’', "'").replace(/[^a-z0-9'-]/g, '');
const fail = (message) => { throw new Error(`Subtitles: ${message}`); };
const fps = timeline.fps;

if (phrases.length !== timeline.segments.length) fail('phrase groups must match all narration scenes');
const scriptWords = timeline.segments.flatMap(({text}) => text.split(/\s+/));
if (scriptWords.length !== words.length) fail('script and timestamp word counts differ; rebuild the narration timings');
words.forEach((word, i) => {
  if (normalize(word.word) !== normalize(scriptWords[i])) fail(`word ${i + 1} differs from the script`);
  if (!Number.isFinite(word.s) || !Number.isFinite(word.e) || word.s < 0 || word.e <= word.s || word.e > timeline.totalDuration) fail(`invalid timing at word ${i + 1}`);
  if (i && word.s < words[i - 1].e - 0.000001) fail(`overlapping word timings at word ${i + 1}`);
});

// Word times already include voiceStart. Preserve the exact script punctuation;
// phrase breaks only control readability, not wording or playback speed.
const cues = [];
let cursor = 0;
timeline.segments.forEach((segment, sceneIndex) => {
  const groups = phrases[sceneIndex];
  if (groups.flat().join(' ') !== segment.text) fail(`scene ${segment.id} phrases must reproduce the script verbatim`);
  for (const lines of groups) {
    if (!Array.isArray(lines) || lines.length < 1 || lines.length > 2 || lines.some(line => typeof line !== 'string' || !line.trim())) fail(`scene ${segment.id} needs one or two non-empty lines per cue`);
    const count = lines.join(' ').split(/\s+/).length;
    const firstWord = cursor;
    const lastWord = cursor + count - 1;
    const first = words[firstWord], last = words[lastWord];
    if (first.s < segment.a / fps || last.e > segment.b / fps) fail(`scene ${segment.id} is inconsistent with the narration boundaries`);
    // Up to 180 ms to finish reading, capped at the next spoken phrase and cut.
    const end = Math.min(last.e + 0.18, words[lastWord + 1]?.s ?? timeline.totalDuration, segment.b / fps);
    const from = Math.round(first.s * fps), to = Math.round(end * fps);
    if (to <= from || (cues.length && from < cues.at(-1).to)) fail(`invalid cue boundary near word ${cursor + 1}`);
    cues.push({id: cues.length + 1, scene: segment.id, from, to, firstWord, lastWord, lines});
    cursor += count;
  }
});
if (cursor !== words.length) fail('not all spoken words are covered');

const stamp = (frame) => {
  const ms = Math.round(frame / fps * 1000);
  const pad = (n, size = 2) => String(n).padStart(size, '0');
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
};
const outputs = {
  'subtitles.json': JSON.stringify({fps, durationInFrames: timeline.durationInFrames, wordCount: words.length, wordStarts: words.map(word => Math.round(word.s * fps)), cues}, null, 2) + '\n',
  'subtitles.srt': cues.map(cue => `${cue.id}\n${stamp(cue.from)} --> ${stamp(cue.to)}\n${cue.lines.join('\n')}\n`).join('\n'),
};
for (const [name, content] of Object.entries(outputs)) {
  const target = path.join(here, name);
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== content) fail(`${name} is stale; run npm run subtitles:data-centres`);
  } else fs.writeFileSync(target, content);
}
console.log(`${process.argv.includes('--check') ? 'Verified' : 'Wrote'} ${cues.length} subtitle cues covering all ${words.length} spoken words.`);
