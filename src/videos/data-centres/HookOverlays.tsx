import React from 'react';
import { loadFont } from '@remotion/fonts';
import { interpolate, staticFile, useCurrentFrame } from 'remotion';
import { HOOK_CUES } from './hook-cues';

loadFont({
  family: 'Barlow Condensed',
  url: staticFile('fonts/BarlowCondensed-ExtraBold.ttf'),
  weight: '800',
}).catch((error) => { console.error('Could not load hook font', error); });

const INK = '#171b25';
const WHITE = '#ffffff';
const YELLOW = '#ffdc55';
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const outlined: React.CSSProperties = {
  paintOrder: 'stroke fill',
  WebkitTextStroke: `8px ${INK}`,
  textShadow: `0 6px 0 ${INK}, 0 9px 10px rgba(0,0,0,0.22)`,
};

export const HookOverlays: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = HOOK_CUES.find(({ from, to }) => frame >= from && frame < to);
  if (!cue) return null;

  const local = frame - cue.from;
  const hit = frame - cue.hit;
  const enter = interpolate(local, [0, 3, 6], [0.96, 1.025, 1], clamp);
  const punch = hit < 0 ? 1 : interpolate(hit, [0, 2, 6], [1, 1.065, 1], clamp);
  const isStat = cue.kind === 'stat';

  return <div data-hook={cue.id} style={{
    position: 'absolute', left: 80, right: 150, top: cue.top,
    textAlign: 'center', pointerEvents: 'none',
    fontFamily: 'Barlow Condensed', fontWeight: 800,
    color: WHITE, lineHeight: 1.05,
    transform: `scale(${enter})`, transformOrigin: 'center center',
  }}>
    <div style={{ ...outlined, fontSize: cue.size, whiteSpace: 'nowrap' }}>
      {cue.lead && <span>{cue.lead} </span>}
      <span style={{
        display: 'inline-block', color: hit >= 0 || isStat ? YELLOW : WHITE,
        transform: `scale(${punch})`, transformOrigin: 'center center',
      }}>{cue.emphasis}</span>
    </div>
    {isStat && <>
      <div style={{ ...outlined, WebkitTextStroke: `5px ${INK}`, fontSize: 48, marginTop: 0 }}>
        DATA-CENTRE ELECTRICITY
      </div>
      <div style={{ ...outlined, WebkitTextStroke: `4px ${INK}`, fontSize: 40, marginTop: 15 }}>
        IEA projection · 2025 → 2030
      </div>
    </>}
  </div>;
};
