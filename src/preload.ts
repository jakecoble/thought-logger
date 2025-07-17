import { contextBridge, ipcRenderer } from "electron";
import { Preferences } from "./preferences";

contextBridge.exposeInMainWorld("permissions", {
  requestPermissionsStatus: () =>
    ipcRenderer.invoke("REQUEST_PERMISSIONS_STATUS"),
});

contextBridge.exposeInMainWorld("userData", {
  openUserDataFolder: () => ipcRenderer.send("OPEN_USER_DATA_FOLDER"),
  getUserDataFolder: () => ipcRenderer.invoke("GET_USER_DATA_FOLDER"),
  listRecentFiles: () => ipcRenderer.invoke("LIST_RECENT_FILES"),
  openFile: (path: string) => ipcRenderer.send("OPEN_FILE", path),
  openExternalUrl: (url: string) => ipcRenderer.send("OPEN_EXTERNAL_URL", url),
  readFile: (path: string) => ipcRenderer.invoke("READ_FILE", path),
  generateAISummary: (path: string) =>
    ipcRenderer.invoke("GENERATE_AI_SUMMARY", path),
});

contextBridge.exposeInMainWorld("preferences", {
  getPreferences: () => ipcRenderer.invoke("GET_PREFERENCES"),
  setPreferences: (prefs: Partial<Preferences>) =>
    ipcRenderer.invoke("SET_PREFERENCES", prefs),
});

contextBridge.exposeInMainWorld("openRouter", {
  checkApiKey: () => ipcRenderer.invoke("CHECK_API_KEY"),
  saveApiKey: (apiKey: string) => ipcRenderer.invoke("SAVE_API_KEY", apiKey),
  getAvailableModels: () => ipcRenderer.invoke("GET_AVAILABLE_MODELS"),
});
