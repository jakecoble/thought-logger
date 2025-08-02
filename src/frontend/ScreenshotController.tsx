import React, { useEffect, useState } from "react";
import { ScreenshotPreferences } from "../preferences";

export function ScreenshotController() {
  const [prefs, setPrefs] = useState<ScreenshotPreferences>({
    screenshotActive: true,
    screenshotPeriod: 60 * 4,
    screenshotQuality: 35,
  });

  useEffect(() => {
    window.preferences.getPreferences().then(setPrefs);
  }, []);

  const updatePreferences = async (
    newPrefs: Partial<ScreenshotPreferences>,
  ) => {
    const updatedPrefs = { ...prefs, ...newPrefs };
    setPrefs(updatedPrefs);
    await window.preferences.setPreferences(newPrefs);
  };

  return (
    <div>
      <h3>Screenshots</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "0.5rem",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <label>Automatic screenshots:</label>
        <input
          type="checkbox"
          checked={prefs.screenshotActive}
          onChange={(event) =>
            updatePreferences({ screenshotActive: event.currentTarget.checked })
          }
        />
        <label>Screenshot quality (0–100):</label>
        <input
          type="text"
          value={prefs.screenshotQuality}
          onChange={(event) =>
            updatePreferences({
              screenshotQuality: Number(event.currentTarget.value),
            })
          }
          style={{ width: "6.25rem" }}
        />
        <label>Interval between screenshots (seconds):</label>
        <input
          type="text"
          value={prefs.screenshotPeriod}
          onChange={(event) =>
            updatePreferences({
              screenshotPeriod: Number(event.currentTarget.value),
            })
          }
          style={{ width: "6.25rem" }}
        />
      </div>
    </div>
  );
}
