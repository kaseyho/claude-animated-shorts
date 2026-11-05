import React, { useEffect, useMemo } from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Stage } from './world';
import { FPS, SHOTS, shotAt } from './story';
import { shotAt as energeticShotAt } from './energetic-story';
import { shotAt as naturalShotAt } from './natural-story';
import { Subtitles } from './Subtitles';
type Props = {
  variant?: 'original' | 'energetic' | 'natural';
  subtitles?: boolean;
  /** Legacy caption visibility alias; explicit subtitles takes precedence. */
  hooks?: boolean;
};

const Scene:React.FC<Props>=({variant='original'})=>{
  const frame=useCurrentFrame();
  const shot=(variant === 'natural' ? naturalShotAt : variant === 'energetic' ? energeticShotAt : shotAt)(frame);
  const {camera,scene}=useThree();
  const stage=useMemo(()=>new Stage(shot.id),[shot.id]);
  useEffect(()=>()=>stage.dispose(),[stage]);
  scene.background=new THREE.Color(stage.background);
  scene.fog=stage.fog;
  const t=frame/FPS-shot.start;
  stage.update(variant !== 'original' ? t * SHOTS[shot.id-1].duration / shot.duration : t,Math.max(0,Math.min(1,t/shot.duration)),camera as THREE.PerspectiveCamera);
  return <primitive object={stage.root} />;
};
export const DataCentres:React.FC<Props>=({variant='original', subtitles, hooks})=>{
  const {width,height}=useVideoConfig();
  const showSubtitles=subtitles ?? hooks ?? (variant === 'natural');
  return <AbsoluteFill style={{background:'#b9dce0'}}>
    {/* Nothing approaches within one world unit: preserve depth precision for thin roofs and details. */}
    <ThreeCanvas width={width} height={height} gl={{antialias:true,powerPreference:'high-performance',toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1}} camera={{fov:38,near:1,far:150}}>
      <Scene variant={variant}/>
    </ThreeCanvas>
    <AbsoluteFill style={{pointerEvents:'none',background:'radial-gradient(ellipse at 50% 44%, transparent 45%, rgba(24,30,52,0.13) 100%)'}}/>
    {showSubtitles && variant === 'natural' && <Subtitles/>}
    <Audio src={staticFile(variant === 'natural' ? 'data-centres-natural/mix.mp3' : variant === 'energetic' ? 'data-centres-energetic/mix.mp3' : 'data-centres/mix.mp3')}/>
  </AbsoluteFill>;
};
