import React from "react";
import { Composition } from "remotion";
import { BridgeShort, BRIDGE_FRAMES } from "./Bridge";
import { FPS } from "./story";

// Import this component into a root; only the selected entry calls registerRoot.
export const BridgeComposition: React.FC = () => (
  <Composition
    id="BridgeShort"
    component={BridgeShort}
    durationInFrames={BRIDGE_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
