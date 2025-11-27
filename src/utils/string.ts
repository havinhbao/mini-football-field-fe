export const buildPath = (basePath: string, subPath: string): string => {
  // Ensure there's exactly one '/' between basePath and subPath
  if (basePath.endsWith('/')) {
    basePath = basePath.slice(0, -1);
  }

  if (subPath.startsWith('/')) {
    subPath = subPath.slice(1);
  }
  return `${basePath}/${subPath}`;
};
