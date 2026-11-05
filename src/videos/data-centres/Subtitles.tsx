import React from 'react';
import {loadFont} from '@remotion/fonts';
import {interpolate, staticFile, useCurrentFrame} from 'remotion';
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

  // Keep the phrase in place and move only its colour emphasis with the voice.
  let spokenWord = cue.firstWord;
  for (let i = cue.firstWord; i <= cue.lastWord; i++) {
    if (frame >= subtitles.wordStarts[i]) spokenWord = i;
    else break;
  }
  let wordIndex = cue.firstWord;
  // A brief settle gives the phrase an accent without shaking readable words.
  const scale = interpolate(frame - cue.from, [0, 3, 6], [0.91, 1.025, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return <div data-subtitle={cue.id} style={{
    position: 'absolute', left: 70, right: 150, bottom: 350,
    pointerEvents: 'none', textAlign: 'center',
    fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 92,
    lineHeight: 1.08, color: '#ffffff',
  }}>
    <div style={{
      display: 'inline-block', padding: '17px 30px 20px',
      background: '#11151e', borderRadius: 16,
      boxShadow: '0 8px 0 rgba(0,0,0,0.25)',
      transform: `scale(${scale})`, transformOrigin: '50% 100%',
    }}>
      {cue.lines.map((line, i) => <div key={i} style={{whiteSpace: 'nowrap'}}>
        {line.split(/\s+/).map((word, j) => {
          const index = wordIndex++;
          return <React.Fragment key={index}>
            {j > 0 ? ' ' : null}
            <span style={{color: index === spokenWord ? '#ffe14a' : '#ffffff'}}>{word}</span>
          </React.Fragment>;
        })}
      </div>)}
    </div>
  </div>;
};
