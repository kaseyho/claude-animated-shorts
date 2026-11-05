import React from "react";
import { Composition } from "remotion";
import { DataCentres } from "./videos/data-centres/DataCentres";
import { TOTAL as ENERGETIC_TOTAL } from "./videos/data-centres/energetic-story";
import { TOTAL as NATURAL_TOTAL } from "./videos/data-centres/natural-story";
import { FPS, TOTAL } from "./videos/data-centres/story";
import { BridgeComposition } from "../templates/bridge/Main";

export const RemotionRoot: React.FC = () => <>
  <BridgeComposition />
  <Composition id="DataCentres" component={DataCentres} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920}/>
  <Composition id="DataCentresEnergetic" component={DataCentres} defaultProps={{variant:"energetic"}} durationInFrames={ENERGETIC_TOTAL} fps={FPS} width={1080} height={1920}/>
  <Composition id="DataCentresNatural" component={DataCentres} defaultProps={{variant:"natural"}} durationInFrames={NATURAL_TOTAL} fps={FPS} width={1080} height={1920}/>
</>;
