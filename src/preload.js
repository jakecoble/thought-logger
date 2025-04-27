import { contextBridge, shell } from 'electron';

contextBridge.exposeInMainWorld('userData', {
  // ... existing exposed methods ...
  openExternalUrl: (url) => shell.openExternal(url),
}); 