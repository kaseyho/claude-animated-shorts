// Standalone alternative entry, runnable directly from this repository.
// To isolate a look pass, copy bridge/ and change only this import to its Main.
import { registerRoot } from "remotion";
import { BridgeComposition } from "./bridge/Main";

registerRoot(BridgeComposition);
