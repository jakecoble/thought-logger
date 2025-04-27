export interface ScreenshotPreferences {
  screenshotActive: boolean;
  screenshotPeriod: number;
  screenshotQuality: number;
}

export interface Preferences extends ScreenshotPreferences {
  blockedApps: string[];
}

export const DEFAULT_PREFERENCES: Preferences = {
  screenshotActive: true,
  screenshotPeriod: 60 * 4,
  screenshotQuality: 35,
  blockedApps: ["Signal", "Signal Desktop", "Messenger", "Messages", "WhatsApp", "Slack"],
};
