import {
  app,
  BrowserWindow,
  ipcMain,
  shell,
} from "electron";
import path from "path";
import fs from "node:fs/promises";
import started from "electron-squirrel-startup";
import { initializeKeylogger, updateKeyloggerPreferences } from "./keylogger";
import { checkPermissions } from "./electron/permissions";
import { Preferences, DEFAULT_PREFERENCES } from "./preferences";
import {
  toggleScheduledScreenshots,
  checkAndGetApiKey,
  saveOpenRouterApiKey
} from "./electron/screenshots";
import { startLocalServer } from "./electron/server";
import { startDailySummaryCheck } from "./electron/summarizer";

const userDataPath = app.getPath("userData");

const filesPath = path.join(userDataPath, "files");
const screenshotFolder = path.join(userDataPath, "files", "screenshots");
const preferencesPath = path.join(userDataPath, "preferences.json");

export async function loadPreferences(): Promise<Preferences> {
  try {
    const data = await fs.readFile(preferencesPath, "utf-8");
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

async function savePreferences(
  prefs: Partial<Preferences>,
): Promise<Preferences> {
  const currentPrefs = await loadPreferences();
  const newPrefs = { ...currentPrefs, ...prefs };
  await fs.writeFile(preferencesPath, JSON.stringify(newPrefs, null, 2));
  return newPrefs;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", function () {
  createWindow();
  loadPreferences().then(toggleScheduledScreenshots);
  startLocalServer();
  // startDailySummaryCheck ();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

initializeKeylogger();

ipcMain.handle("REQUEST_PERMISSIONS_STATUS", () => {
  return checkPermissions();
});

ipcMain.handle("GET_USER_DATA_FOLDER", () => {
  return filesPath;
});

ipcMain.on("OPEN_USER_DATA_FOLDER", async () => {
  await fs.mkdir(screenshotFolder, { recursive: true });
  shell.openPath(filesPath);
});

ipcMain.handle("GET_PREFERENCES", () => loadPreferences());

ipcMain.handle(
  "SET_PREFERENCES",
  async (_event, prefs: Partial<Preferences>) => {
    const newPrefs = await savePreferences(prefs);
    toggleScheduledScreenshots(newPrefs);
    updateKeyloggerPreferences(newPrefs);
  },
);

async function walkDir(dir: string, allEntries: string[]) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(full, allEntries);
    } else {
      allEntries.push(full);
    }
  }
}

ipcMain.handle("LIST_RECENT_FILES", async () => {
  const userDataPath = app.getPath("userData");
  const filesDir = path.join(userDataPath, "files");
  try {
    // For example: read the "files" directory recursively, 
    // collect file paths, sort them (newest first), 
    // and return the first N results.
    // The specifics of listing "recent" are up to your logic:
    // e.g., you could check subfolders, filter by extension, or sort by stat.mtime.
    const allEntries: string[] = [];

    await walkDir(filesDir, allEntries);

    // Sort by modification time descending
    const datedPaths: { path: string; mtime: number }[] = [];
    for (const filePath of allEntries) {
      // Skip .DS_Store files
      if (path.basename(filePath) === ".DS_Store") continue;
      
      const stat = await fs.stat(filePath);
      datedPaths.push({ path: filePath, mtime: stat.mtimeMs });
    }
    datedPaths.sort((a, b) => b.mtime - a.mtime);

    // Return a limited list, e.g. 20 items
    return datedPaths.slice(0, 20).map((x) => x.path);
  } catch (error) {
    console.error("Failed to list recent files:", error);
    return [];
  }
});

ipcMain.on("OPEN_FILE", (_event, filePath) => {
  shell.openPath(filePath);
});

ipcMain.on("OPEN_EXTERNAL_URL", (_event, url) => {
  shell.openExternal(url).catch(err => {
    console.error("Failed to open external URL:", err);
  });
});

ipcMain.handle("CHECK_API_KEY", () => {
  return checkAndGetApiKey();
});

ipcMain.handle("SAVE_API_KEY", (_event, apiKey: string) => {
  return saveOpenRouterApiKey(apiKey);
});

ipcMain.handle("READ_FILE", async (_event, filePath: string) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error("Failed to read file:", error);
    throw error;
  }
});
