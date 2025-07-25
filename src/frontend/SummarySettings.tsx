import React, { useEffect, useState } from "react";

import { SummaryPreferences, DEFAULT_PREFERENCES } from "../preferences";
import TypeaheadDropdown from "./TypeaheadDropdown";

const SummarySettings = () => {
  const [summaryPrefs, setSummaryPrefs] = useState<SummaryPreferences>({
    summaryModel: DEFAULT_PREFERENCES.summaryModel,
    dailySummaryPrompt: DEFAULT_PREFERENCES.dailySummaryPrompt,
    weeklySummaryPrompt: DEFAULT_PREFERENCES.weeklySummaryPrompt,
  });
  const [availableModels, setAvailableModels] = useState<string[]>([
    "loading...", // FIXME
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
    <div style={{ margin: "5px 0 5px 0" }}>
      <h3>Summary Settings</h3>

      <label
        htmlFor="daily-prompt"
        style={{ display: "block", marginTop: "5px" }}
      >
        Daily Summary prompt
      </label>
      <textarea
        id="daily-prompt"
        style={{
          width: "100%",
          padding: "5px",
          outline: "2px solid lightblue",
        }}
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

      <label
        htmlFor="weekly-prompt"
        style={{ display: "block", marginTop: "5px" }}
      >
        Weekly Summary prompt
      </label>

      <textarea
        id="weekly-prompt"
        style={{
          width: "100%",
          padding: "5px",
          outline: "2px solid lightblue",
        }}
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

      <label htmlFor="summary-model" style={{ display: "block" }}>
        Summary model
      </label>
      <TypeaheadDropdown
        initial={summaryPrefs.summaryModel}
        onChange={(model) => {
          setSummaryPrefs({ ...summaryPrefs, summaryModel: model });
          window.preferences.setPreferences({
            summaryModel: model,
          });
        }}
        items={availableModels}
      />
    </div>
  );
};

export default SummarySettings;
