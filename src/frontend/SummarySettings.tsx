import React, { useEffect, useState } from "react";
import Dropdown from "react-dropdown";

import { SummaryPreferences, DEFAULT_PREFERENCES } from "../preferences";

const SummarySettings = () => {
  const [summaryPrefs, setSummaryPrefs] = useState<SummaryPreferences>({
    summaryModel: DEFAULT_PREFERENCES.summaryModel,
    summaryPrompt: DEFAULT_PREFERENCES.summaryPrompt,
  });
  const [availableModels, setAvailableModels] = useState<string[]>([
    "loading...",
  ]);

  useEffect(() => {
    window.preferences.getPreferences().then((prefs) => {
      setSummaryPrefs({
        summaryModel: prefs.summaryModel,
        summaryPrompt: prefs.summaryPrompt,
      });
    });

    window.openRouter
      .getAvailableModels()
      .then((models) => setAvailableModels(models));
  }, []);

  return (
    <div>
      <h3>Summary Settings</h3>

      <label style={{ display: "block" }}>
        Summary prompt
        <input
          type="text"
          onChange={(e) => {
            setSummaryPrefs({ ...summaryPrefs, summaryPrompt: e.target.value });
            window.preferences.setPreferences({
              summaryPrompt: e.target.value,
            });
          }}
          value={summaryPrefs.summaryPrompt}
        />
      </label>

      <label style={{ display: "block" }}>
        Summary model
        <Dropdown
          onChange={(option) =>
            setSummaryPrefs({ ...summaryPrefs, summaryModel: option })
          }
          options={availableModels}
          value={summaryPrefs.summaryModel}
        />
      </label>
    </div>
  );
};

export default SummarySettings;
