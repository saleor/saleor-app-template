import { parse, join } from "path";

/**
 * Returns path to current view.
 * Should be used only inside files in the /pages directory.
 */
export const currentRoutePath = () => {
  const relativeToPagesDir = __filename.split("pages")[1];
  const parsed = parse(relativeToPagesDir);
  return join(parsed.dir, parsed.name);
};

export default currentRoutePath;
