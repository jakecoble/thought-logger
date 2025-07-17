import {
  type PermissionScope,
  PermissionStatus,
} from "../electron/permissions";
import { Preferences } from "../preferences";

declare global {
  interface Window {
    preferences: {
      getPreferences: () => Promise<Preferences>;
      setPreferences: (prefs: Partial<Preferences>) => Promise<void>;
    };
    userData: {
      openUserDataFolder: () => void;
      getUserDataFolder: () => Promise<string>;
      listRecentFiles: () => Promise<string[]>;
      openFile: (filePath: string) => void;
      openExternalUrl: (url: string) => void;
      readFile: (filePath: string) => Promise<string>;
      generateAISummary: (filePath: string) => Promise<string>;
    };
    permissions: {
      requestPermissionsStatus: () => Promise<
        Record<PermissionScope, PermissionStatus>
      >;
    };
    openRouter: {
      checkApiKey: () => Promise<{ hasKey: boolean; message: string }>;
      saveApiKey: (
        apiKey: string,
      ) => Promise<{ success: boolean; message: string }>;
      getAvailableModels: () => Promise<string[]>;
    };
  }
}

export {};
