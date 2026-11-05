import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { FPS } from './story';
import { SHOTS } from './natural-story';

// Seconds relative to the measured narration's scene boundaries. These are
// occasional editorial hooks, not subtitles. Keep factual qualifications visible.
export const HOOKS = [
  { shot: 1, offset: 0.35, seconds: 3.3, lines: ['WOULD YOU WANT', 'THIS NEXT DOOR?'] },
  { shot: 3, offset: 3.1, seconds: 4.1, lines: ['TWICE THE', 'ELECTRICITY?'], detail: 'IEA projection · 2025 → 2030' },
  { shot: 4, offset: 0.65, seconds: 3.8, lines: ["WHO’S PAYING", 'FOR THE UPGRADE?'] },
  { shot: 7, offset: 0.9, seconds: 3.8, lines: ['THE NEIGHBOURS', 'WANT ANSWERS'] },
  { shot: 10, offset: 2.9, seconds: 3.8, lines: ['YOUR STREET.', 'YOUR SAY?'] },
];

export const HookOverlays: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = HOOKS.find((hook) => {
    const start = Math.round((SHOTS[hook.shot - 1].start + hook.offset) * FPS);
    return frame >= start && frame < start + Math.round(hook.seconds * FPS);
  });
  if (!cue) return null;
  const local = frame - Math.round((SHOTS[cue.shot - 1].start + cue.offset) * FPS);
  const duration = Math.round(cue.seconds * FPS);
  const opacity = interpolate(local, [0, 7, duration - 10, duration], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const enter = interpolate(local, [0, 9], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      position: 'absolute', top: 150, left: 80, right: 80,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      opacity, transform: `translateY(${(1 - enter) * 20}px) scale(${0.96 + enter * 0.04})`,
      pointerEvents: 'none', fontFamily: 'Arial, Helvetica, sans-serif',
    }}>
      <div style={{
        padding: '26px 34px 28px', borderRadius: 18,
        background: '#202536', border: '3px solid rgba(255,255,255,0.85)',
        boxShadow: '0 10px 0 rgba(32,37,54,0.20)', textAlign: 'center',
      }}>
        {cue.lines.map((line, index) => <div key={line} style={{
          color: index === 1 ? '#ffcf59' : '#ffffff',
          fontSize: 66, fontWeight: 900, lineHeight: 1.08, letterSpacing: -1.7,
          whiteSpace: 'nowrap',
        }}>{line}</div>)}
        {cue.detail && <div style={{ color: '#e9edf4', fontSize: 27, fontWeight: 600, marginTop: 16 }}>{cue.detail}</div>}
      </div>
    </div>
  );
};
