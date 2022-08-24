import { APL } from "./apl";
import { ManifestFunction } from "./manifest";

export interface AppConf {
  auth: APL;
  manifest?: ManifestFunction;
}
