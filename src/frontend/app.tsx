import React from "react";
import { FileInfo } from "./FileInfo";
import { Permissions } from "./Permissions";
import { ScreenshotController } from "./ScreenshotController";
import BlockedAppsEditor from "./BlockedAppsEditor";
import ApiKeySettings from "./ApiKeySettings";

export function App() {
  return (
    <div>
      <FileInfo />
      <ScreenshotController />
      <ApiKeySettings />
      <Permissions />
      <BlockedAppsEditor />
    </div>
  );
}
