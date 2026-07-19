/** Radar blip geometry in the 32×32 mark viewBox (center 16,16). */

export type RadarBlip = {
  cx: number;
  cy: number;
  r: number;
  opacity?: number;
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

/**
 * Map a publication datetime onto three contact blips:
 * - outer ring ← hour (+ minute drift)
 * - middle ring ← minute
 * - inner ring ← day of month
 * Sparse on purpose — reads as radar contacts, not noise.
 */
export function radarBlipsFromDate(date: Date): RadarBlip[] {
  const hours = date.getHours() + date.getMinutes() / 60;
  const minutes = date.getMinutes() + date.getSeconds() / 60;
  const day = date.getDate();

  const hourAngle = (hours / 12) * 360;
  const minuteAngle = (minutes / 60) * 360;
  const dayAngle = (day / 31) * 360;

  return [
    blipAt(11, hourAngle, 1.35),
    blipAt(7.5, minuteAngle, 1.5),
    blipAt(3.75, dayAngle, 1.25),
  ];
}

/** Stable brand mark for header / favicon (not time-varying). */
export const BRAND_RADAR_BLIPS: RadarBlip[] = [
  blipAt(11, 38, 1.3),
  blipAt(7.5, 210, 1.45),
  blipAt(3.75, 300, 1.2),
];
