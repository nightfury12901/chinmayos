export const CONSTANTS = {
  WORLD_WIDTH: 2400,
  WORLD_HEIGHT: 720,
  SCOPE_RADIUS: 360,
  SWAY_BASE: 3.0,
  SWAY_FREQUENCY_X: 0.8,
  SWAY_FREQUENCY_Y: 0.6,
  BREATH_HOLD_DURATION: 3000,
  BREATH_RECHARGE_DURATION: 5000,
  BULLET_SPEED: 800,
  DRIFT_FACTOR: 0.002,
  RAIN_PARTICLE_COUNT: 200,
  NPC_WALK_SPEED: 60,
  NPC_LIMP_SPEED: 35,
  SCANLINE_ALPHA: 0.15,
  ZOOM_LEVELS: [2, 4, 8],
  
  COLORS: {
    BG_DEEP: 0x0a0a0f,
    NEON_CYAN: 0x00ffff,
    NEON_PINK: 0xff00aa,
    NEON_ORANGE: 0xff6600,
    NEON_GREEN: 0x00ff41,
    NEON_YELLOW: 0xffee00,
    WINDOW_WARM: 0xffaa44,
    WINDOW_COLD: 0x44aaff,
  },
  
  WEAPONS: {
    M24:   { id: 'M24', name: 'M24', damage: 7, stability: 8, zoom: 4, suppressed: false, mag: 5,  reload: 2500, sway: 1.0 },
    VSS:   { id: 'VSS', name: 'VSS Vintorez', damage: 6, stability: 9, zoom: 4, suppressed: true,  mag: 10, reload: 2000, sway: 0.7 },
    AWM:   { id: 'AWM', name: 'AWM', damage: 10, stability: 5, zoom: 8, suppressed: false, mag: 3,  reload: 3500, sway: 1.6 },
    DSR1:  { id: 'DSR1', name: 'DSR-1', damage: 9, stability: 7, zoom: 6, suppressed: true,  mag: 5,  reload: 3000, sway: 1.1 },
  },
  
  WEAPON_COSTS: { VSS: 800, AWM: 2000, DSR1: 4000 },
  MAP_XP_REQUIREMENTS: { HarborDocks: 500, RooftopGardens: 1500 }
};
