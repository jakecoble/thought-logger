import React, { useEffect, useState } from "react";

const BlockedAppsEditor = () => {
  const [blockedApps, setBlockedApps] = useState<string[]>([]);
  const [newApp, setNewApp] = useState<string>("");

  useEffect(() => {
    window.preferences.getPreferences().then((prefs) => {
      setBlockedApps(prefs.blockedApps);
    });
  }, []);

  const addApp = async () => {
    if (newApp.trim() !== "") {
      const updatedApps = [...blockedApps, newApp.trim()];
      setBlockedApps(updatedApps);
      await window.preferences.setPreferences({ blockedApps: updatedApps });
      
      setNewApp("");
    }
  };

  const removeApp = async (appToRemove: string) => {
    const updatedApps = blockedApps.filter((app) => app !== appToRemove);
    setBlockedApps(updatedApps);
    await window.preferences.setPreferences({ blockedApps: updatedApps });
  };

  return (
    <div>
      <h3>Blocked Apps</h3>
      <table style={{ borderCollapse: "collapse", marginBottom: 16 }}>
        <tbody>
          {blockedApps.sort().reverse().map((app) => (
            <tr key={app}>
              <td>{app}</td>
              <td style={{ textAlign: "right" }}>
                <button onClick={() => removeApp(app)} style={{ marginLeft: 8 }}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <input
        type="text"
        value={newApp}
        onChange={(e) => setNewApp(e.target.value)}
        placeholder="Add new app"
      />
      <button onClick={addApp} style={{ marginLeft: 8 }}>
        Add
      </button>
    </div>
  );
};

export default BlockedAppsEditor; 