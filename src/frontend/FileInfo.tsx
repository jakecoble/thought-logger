import React, { useEffect, useState } from "react";
import { groupBy } from 'lodash';

function openFolder() {
  window.userData.openUserDataFolder();
}

export function FileInfo() {
  const [dataFolder, setDataFolder] = useState("(loading)");
  const [filesByDate, setFilesByDate] = useState<Record<string, string[]>>({});

  useEffect(() => {
    window.userData.getUserDataFolder().then((path) => setDataFolder(path));
    window.userData.listRecentFiles().then((files) => {
      // Group files by date
      const grouped = groupBy(files, (file) => 
        file.split("/").slice(-1)[0].split(".")[0] // Extract date from YYYY-MM-DD.rest.ext format
      );
      setFilesByDate(grouped);
    });
  }, []);

  const getFileName = (file: string) => {
    return file.split("/").slice(-1)[0].split(".").slice(1,3).join(".");
  }
  return (
    <div>
      <h3>User files</h3>
      <p>
        This app takes screenshots at regular intervals (configurable below),
        and logs mouse and keyboard inputs.
      </p>
      <button onClick={openFolder}>Open Files Folder</button> <span style={{marginLeft: 8 , fontSize: 12, color: "gray"}}>{dataFolder}</span>

      <div style={{display: "flex", gap: "10px"}}>  
        <a href="http://localhost:8765/today" 
           onClick={(e) => { e.preventDefault(); window.userData.openExternalUrl("http://localhost:8765/today"); }}
           style={{color: "blue", textDecoration: "none", cursor: "pointer"}}>today</a>
        <a href="http://localhost:8765/yesterday" 
           onClick={(e) => { e.preventDefault(); window.userData.openExternalUrl("http://localhost:8765/yesterday"); }}
           style={{color: "blue", textDecoration: "none", cursor: "pointer"}}>yesterday</a>
        <a href="http://localhost:8765/last7days" 
           onClick={(e) => { e.preventDefault(); window.userData.openExternalUrl("http://localhost:8765/week"); }}
           style={{color: "blue", textDecoration: "none", cursor: "pointer"}}>week</a>
      </div>
    
      <h4>Recent Files</h4>
      {Object.entries(filesByDate).map(([date, files]) => (
        <div key={date} style={{ display: "flex", gap: "10px", whiteSpace: "nowrap", fontSize: 12}}>
          <div style={{ width: 75 }}>{date}</div>
          <div style={{ display: "flex", gap: "10px" }}>
            {files.sort((a,b) => a.localeCompare(b)).map((file) => (
              <div 
                onClick={() => window.userData.openFile(file)} 
                key={file}
                style={{ color: "blue", cursor: "pointer" }}
              >
                {getFileName(file) === "log" ? "log" : getFileName(file).split("processed.")[1]}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
