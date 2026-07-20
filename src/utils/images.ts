/** Discover / social / schema image helpers */

import { SITE_URL } from '../consts';

export function absUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return new URL(path, SITE_URL).href;
}

/** Derive 16:9 / 4:3 / 1:1 crop paths from a hero image path. */
export function imageCropPaths(imagePath: string): {
  original: string;
  '16x9': string;
  '4x3': string;
  '1x1': string;
} {
  const m = imagePath.match(/^(.*)(\.[^.]+)$/);
  const stem = m ? m[1] : imagePath;
  const ext = m ? m[2] : '.jpg';
  return {
    original: imagePath,
    '16x9': `${stem}-16x9${ext}`,
    '4x3': `${stem}-4x3${ext}`,
    '1x1': `${stem}-1x1${ext}`,
  };
}

/** Schema.org ImageObject list for Discover (multiple aspect ratios, ≥1200px wide). */
export function schemaImageObjects(
  imagePath: string | undefined,
  alt?: string,
): Array<Record<string, unknown>> | undefined {
  if (!imagePath) return undefined;
  const crops = imageCropPaths(imagePath);
  const caption = alt || undefined;
  return [
    {
      '@type': 'ImageObject',
      url: absUrl(crops['16x9']),
      width: 1200,
      height: 675,
      ...(caption ? { caption } : {}),
    },
    {
      '@type': 'ImageObject',
      url: absUrl(crops['4x3']),
      width: 1200,
      height: 900,
      ...(caption ? { caption } : {}),
    },
    {
      '@type': 'ImageObject',
      url: absUrl(crops['1x1']),
      width: 1200,
      height: 1200,
      ...(caption ? { caption } : {}),
    },
    {
      '@type': 'ImageObject',
      url: absUrl(crops.original),
      width: 1600,
      height: 900,
      ...(caption ? { caption } : {}),
    },
  ];
}
