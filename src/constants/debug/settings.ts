export const DEBUG_CONFIG = {
  GET_ENABLE_CAMERA_CONTROLS: () => {
    const pathname = window.location.pathname;
    return pathname === "/debug";
  },
  ENABLE_ANTIALIASING: true,
  ENABLE_LIGHT_CONTROLS: false,
} as const;
