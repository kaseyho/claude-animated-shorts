import React from 'react';
import {loadFont} from '@remotion/fonts';
import {staticFile, useCurrentFrame} from 'remotion';
import subtitles from '../../../production/data-centres-natural/subtitles.json';

loadFont({
  family: 'Barlow Condensed',
  url: staticFile('fonts/BarlowCondensed-ExtraBold.ttf'),
  weight: '800',
});

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = subtitles.cues.find(({from, to}) => frame >= from && frame < to);
  if (!cue) return null;

  return <div data-subtitle={cue.id} style={{
    position: 'absolute', left: 80, right: 160, bottom: 360,
    pointerEvents: 'none', textAlign: 'center',
    fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 74,
    lineHeight: 1.13, color: '#ffffff',
    paintOrder: 'stroke fill', WebkitTextStroke: '7px #171b25',
    textShadow: '0 5px 0 #171b25, 0 7px 9px rgba(0,0,0,0.3)',
  }}>
    {cue.lines.map((line, i) => <div key={i} style={{whiteSpace: 'nowrap'}}>{line}</div>)}
  </div>;
};
