// Six Cities ring-to-ring joining grammar.
// Extracted from the Observer eye ocular seat in Betwixt, 2026-10-08.
// Source: observer-and-engine.js / world-lab.html, seatFront z=0, seatBack z=-0.11.
export const JOINED_RING_CENTERLINE_SPACING = 0.11;
export const OBSERVER_SEAT_RING_TUBE_RADIUS = 0.035;
export const OBSERVER_SEAT_CLEAR_GAP = JOINED_RING_CENTERLINE_SPACING - 2 * OBSERVER_SEAT_RING_TUBE_RADIUS; // 0.04

// A joint consists of two coaxial rings with this axial centerline spacing.
// No connector bars, sleeves, or rails are required to span the gap.
// When using another ring tube radius, the visible clearance changes accordingly.
export function joinedRingOffset(axis = 'z', sign = -1) {
  if (!['x','y','z'].includes(axis)) throw new Error('axis must be x, y, or z');
  if (sign !== 1 && sign !== -1) throw new Error('sign must be +1 or -1');
  return { x: axis === 'x' ? sign * JOINED_RING_CENTERLINE_SPACING : 0,
           y: axis === 'y' ? sign * JOINED_RING_CENTERLINE_SPACING : 0,
           z: axis === 'z' ? sign * JOINED_RING_CENTERLINE_SPACING : 0 };
}
