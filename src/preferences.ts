export interface ScreenshotPreferences {
  screenshotActive: boolean;
  screenshotPeriod: number;
  screenshotQuality: number;
}

export interface SummaryPreferences {
  summaryPrompt: string;
  summaryModel: string;
}

export interface Preferences extends ScreenshotPreferences, SummaryPreferences {
  blockedApps: string[];
}

export const DEFAULT_PREFERENCES: Preferences = {
  screenshotActive: true,
  screenshotPeriod: 60 * 4,
  screenshotQuality: 35,
  blockedApps: [
    "Signal",
    "Signal Desktop",
    "Messenger",
    "Messages",
    "WhatsApp",
    "Slack",
  ],
  summaryPrompt:
    "Please analyze this computer activity log and summarize the major projects and tasks worked on:",
  summaryModel: "anthropic/claude-3.5-sonnet", // TODO select this from the available models
};
