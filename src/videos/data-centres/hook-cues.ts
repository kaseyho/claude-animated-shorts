import words from '../../../production/data-centres-natural/words.json';
import { FPS } from './story';
import { SHOTS, TOTAL } from './natural-story';

// Match native narration instead of guessing offsets from scene starts.
// A changed or ambiguous anchor must fail rather than mistime a hook silently.
const normalize = (word: string) => word.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9-]/g, '');
const at = (phrase: string, occurrence?: number): number => {
  const tokens = phrase.split(' ').map(normalize);
  const matches = words.filter((_, i) => tokens.every((token, j) => normalize(words[i + j]?.word ?? '') === token));
  const match = matches[occurrence ?? 0];
  if (!match || (occurrence === undefined && matches.length !== 1)) {
    throw new Error(`Hook anchor "${phrase}" has ${matches.length} matches; update hook-cues.ts for the current narration.`);
  }
  return match.s;
};

type Cue = {
  id: string;
  from: number;
  to: number;
  hit: number;
  top: number;
  size: number;
  lead?: string;
  emphasis: string;
  kind?: 'stat';
};
const frameCue = (cue: Cue): Cue => ({
  ...cue,
  from: Math.round(cue.from * FPS),
  to: Math.round(cue.to * FPS),
  hit: Math.round(cue.hit * FPS),
});

// One state at a time. Positions are in the 1080×1920 design canvas.
// Research and editorial rationale: docs/shorts-text-research.md.
export const HOOK_CUES: readonly Cue[] = ([
  { id: 'harmless', from: 0, to: at('Until') - 0.12, hit: at('harmless'), top: 515, size: 142, emphasis: 'Harmless?' },
  { id: 'next-door', from: at('next door', 0), to: at('Suddenly'), hit: at('door', 0), top: 385, size: 142, lead: 'Next', emphasis: 'door.' },
  { id: 'personal', from: at("it's personal"), to: SHOTS[0].b / FPS, hit: at('personal'), top: 385, size: 138, lead: 'It’s', emphasis: 'personal.' },
  { id: 'electricity', from: at('roughly double'), to: SHOTS[2].b / FPS, hit: at('double'), top: 120, size: 200, emphasis: '≈2×', kind: 'stat' },
  { id: 'paying', from: at("who's paying"), to: SHOTS[3].b / FPS - 0.3, hit: at('paying'), top: 350, size: 138, lead: 'Who’s', emphasis: 'paying?' },
  { id: 'noise', from: at('noise from'), to: at('noise from') + 1.62, hit: at('noise from'), top: 480, size: 142, lead: 'The', emphasis: 'noise.' },
  { id: 'answers', from: at('demanded'), to: at('doorstep') + 0.59, hit: at('answers'), top: 545, size: 134, lead: 'Clearer', emphasis: 'answers.' },
  { id: 'before', from: at('before construction'), to: SHOTS[8].b / FPS - 0.17, hit: at('before construction'), top: 480, size: 126, lead: 'Before', emphasis: 'they build.' },
  { id: 'say', from: at("shouldn't"), to: TOTAL / FPS, hit: at('say'), top: 440, size: 144, lead: 'Get a', emphasis: 'say?' },
] satisfies Cue[]).map(frameCue);
