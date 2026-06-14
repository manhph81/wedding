/**
 * API endpoint paths (relative tới VITE_API_BASE, default /api/v1).
 * Convention: kebab-case URL, group theo resource.
 */
export const API_PATHS = {
  health: "/health",
  rsvp: "/rsvp",
  wishes: "/wishes",
} as const;
