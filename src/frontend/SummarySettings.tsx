import React, { useEffect, useState } from "react";
import Dropdown from "react-dropdown";

import { SummaryPreferences, DEFAULT_PREFERENCES } from "../preferences";

const SummarySettings = () => {
  const [summaryPrefs, setSummaryPrefs] = useState<SummaryPreferences>({
    summaryModel: DEFAULT_PREFERENCES.summaryModel,
    dailySummaryPrompt: DEFAULT_PREFERENCES.dailySummaryPrompt,
    weeklySummaryPrompt: DEFAULT_PREFERENCES.weeklySummaryPrompt,
  });
  const [availableModels, setAvailableModels] = useState<string[]>([
    "loading...",
  ]);

  useEffect(() => {
    window.preferences.getPreferences().then((prefs) => {
      setSummaryPrefs({
        summaryModel: prefs.summaryModel,
        dailySummaryPrompt: prefs.dailySummaryPrompt,
        weeklySummaryPrompt: prefs.weeklySummaryPrompt,
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
        Daily Summary prompt
        <textarea
          onChange={(e) => {
            setSummaryPrefs({
              ...summaryPrefs,
              dailySummaryPrompt: e.target.value,
            });
            window.preferences.setPreferences({
              dailySummaryPrompt: e.target.value,
            });
          }}
          value={summaryPrefs.dailySummaryPrompt}
        />
      </label>

      <label style={{ display: "block" }}>
        Weekly Summary prompt
        <textarea
          onChange={(e) => {
            setSummaryPrefs({
              ...summaryPrefs,
              weeklySummaryPrompt: e.target.value,
            });
            window.preferences.setPreferences({
              weeklySummaryPrompt: e.target.value,
            });
          }}
          value={summaryPrefs.weeklySummaryPrompt}
        />
      </label>

      <label style={{ display: "block" }}>
        Summary model
        <Dropdown
          onChange={(option) =>
            setSummaryPrefs({ ...summaryPrefs, summaryModel: option.value })
          }
          options={availableModels}
          value={summaryPrefs.summaryModel}
        />
      </label>
    </div>
  );
};

export default SummarySettings;
