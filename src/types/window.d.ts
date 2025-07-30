import {
  type PermissionScope,
  PermissionStatus,
} from "../electron/permissions";
import { Preferences } from "../preferences";
import { SerializedLog } from "./files";

declare global {
  interface UserData {
    openUserDataFolder: () => void;
    getUserDataFolder: () => Promise<string>;
    getRecentLogs: () => Promise<SerializedLog[]>;
    openFile: (filePath: string) => void;
    openExternalUrl: (url: string) => void;
    readFile: (filePath: string) => Promise<string>;
    generateAISummary: (log: SerializedLog) => Promise<string>;
    onUpdateRecentLogs: (callback: (logs: SerializedLog[]) => void) => void;
  }

  interface Window {
    preferences: {
      getPreferences: () => Promise<Preferences>;
      setPreferences: (prefs: Partial<Preferences>) => Promise<void>;
    };
    userData: UserData;
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
