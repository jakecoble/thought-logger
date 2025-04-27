import { systemPreferences } from "electron";

export type PermissionScope = "screen" | "keylogging";

export type PermissionStatus =
  | "not-determined"
  | "granted"
  | "denied"
  | "restricted"
  | "unknown";

export function checkPermissions(): Record<PermissionScope, PermissionStatus> {
  if (process.platform === "darwin") {
    return {
      // camera: systemPreferences.getMediaAccessStatus("camera"),
      // microphone: systemPreferences.getMediaAccessStatus("microphone"),
      screen: systemPreferences.getMediaAccessStatus("screen"),
      keylogging: systemPreferences.isTrustedAccessibilityClient(false)
      ? "granted"
      : "denied",
    };
  }

  return {
    // camera: "unknown",
    // microphone: "unknown",
    screen: "unknown",
    keylogging: "unknown",
  };
}
