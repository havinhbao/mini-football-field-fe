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

export const buildPriceString = (price: number): string => {
  return price.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
