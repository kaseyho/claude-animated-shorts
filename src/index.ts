import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

// Keep registration outside component files so Fast Refresh cannot repeat it.
registerRoot(RemotionRoot);
