/** Radar blip geometry in the 32×32 mark viewBox (center 16,16). */

export type RadarBlip = {
  cx: number;
  cy: number;
  r: number;
};

function blipAt(radius: number, degreesFromTop: number, size: number): RadarBlip {
  // 0° = 12 o'clock (radar/clock style)
  const rad = ((degreesFromTop - 90) * Math.PI) / 180;
  return {
    cx: 16 + radius * Math.cos(rad),
    cy: 16 + radius * Math.sin(rad),
    r: size,
  };
}

/** Brand / favicon / header: one contact at the center. */
export const BRAND_RADAR_BLIPS: RadarBlip[] = [{ cx: 16, cy: 16, r: 1.6 }];

/**
 * One contact blip from a publication datetime (for story-specific marks).
 * Ring from hour; angle from minute + day — unique without looking like a target.
 */
export function radarBlipsFromDate(date: Date): RadarBlip[] {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDate();

  const rings = [11, 7.5, 3.75] as const;
  const ring = rings[hours % 3];
  const angle = ((minutes * 6) + (day * 11.6)) % 360;

  return [blipAt(ring, angle, 1.55)];
}
