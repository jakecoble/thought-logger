import React, { useEffect, useState, useCallback } from "react";
import { groupBy } from 'lodash';

function openFolder() {
  window.userData.openUserDataFolder();
}

const isAiSummary = (file: string) => file.includes("aisummary");

const getFileName = (file: string) => {
  const parts = file.split("/").slice(-1)[0].split(".");
  if (isAiSummary(file)) return "ai summary";
  return parts.slice(1,3).join(".");
};

export function FileInfo() {
  const [dataFolder, setDataFolder] = useState("(loading)");
  const [filesByDate, setFilesByDate] = useState<Record<string, string[]>>({});
  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  useEffect(() => {
    window.userData.getUserDataFolder().then(setDataFolder);
    window.userData.listRecentFiles().then((files) => {
      setFilesByDate(groupBy(files, file => file.split("/").slice(-1)[0].split(".")[0]));
    });
  }, []);

  useEffect(() => {
    const allFiles = Object.values(filesByDate).flat();
    Promise.all(allFiles.map(file =>
      file in fileContents
        ? Promise.resolve()
        : window.userData.readFile(file)
            .then(content => setFileContents(prev => ({ ...prev, [file]: content })))
            .catch(() => setFileContents(prev => ({ ...prev, [file]: "(error loading file)" })))
    ));
  }, [filesByDate]);

  const getFormattedFile = (file: string) => {
    const content = fileContents[file];
    if (!content) return "Loading...";
    const newContent = "1. " + content.split("1.")[1];
    const paragraphs = newContent.split(/\n\s*\n/);
    // Check if the last paragraph starts with a number
    const last = paragraphs[paragraphs.length - 1];
    if (last && !/^\d/.test(last.trim())) {
      paragraphs.pop();
    }
    return paragraphs.join("\n\n");
  };

  return (
    <div>
      <h3>User files</h3>
      <p>
        This app takes screenshots at regular intervals (configurable below),
        and logs mouse and keyboard inputs.
      </p>
      <button onClick={openFolder} className="ml-0">
        Open Files Folder
      </button>
      <span className="ml-2 text-xs text-gray-500">{dataFolder}</span>

      <div className="flex gap-2.5">
        <a
          href="http://localhost:8765/today"
          onClick={(e) => { e.preventDefault(); window.userData.openExternalUrl("http://localhost:8765/today"); }}
          className="text-blue-600 no-underline cursor-pointer"
        >today</a>
        <a
          href="http://localhost:8765/yesterday"
          onClick={(e) => { e.preventDefault(); window.userData.openExternalUrl("http://localhost:8765/yesterday"); }}
          className="text-blue-600 no-underline cursor-pointer"
        >yesterday</a>
        <a
          href="http://localhost:8765/last7days"
          onClick={(e) => { e.preventDefault(); window.userData.openExternalUrl("http://localhost:8765/week"); }}
          className="text-blue-600 no-underline cursor-pointer"
        >week</a>
      </div>
    
      <div className="flex gap-5 mt-5">
        <div className="min-w-[300px]">
          {Object.entries(filesByDate)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([date, files]) => {
              // Find raw and processed log files for this date
              const rawFile = files.find(f => !isAiSummary(f) && !f.includes('.processed.'));
              const processedFiles = files.filter(f => !isAiSummary(f) && f.includes('.processed.'));
              return (
              <div key={date} className="mb-2.5">
                <div className="mb-1 font-bold flex items-center">
                  <span className="mr-auto">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  {rawFile &&
                    <button
                      className="ml-2 px-2 py-0.5 text-xs text-blue-800 font-normal"
                      onClick={() => window.userData.openExternalUrl(`file://${rawFile}`)}
                    >raw</button>
                  }
                  {processedFiles.map(f => (
                    <button
                      key={f}
                      className="ml-2 px-2 py-0.5 text-xs text-green-800 font-normal"
                      onClick={() => window.userData.openExternalUrl(`file://${f}`)}
                    >{f.split('.').slice(1,3).join('.')}</button>
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  {files
                    .sort((a, b) => isAiSummary(a) === isAiSummary(b) ? a.localeCompare(b) : isAiSummary(a) ? -1 : 1)
                    .map(file => {
                      if (isAiSummary(file)) {
                        return <div key={file} className="whitespace-pre-wrap bg-gray-100 p-3 rounded text-sm">
                          {getFormattedFile(file)}
                        </div>
                      }
                    })}
                </div>
              </div>
            )})}
        </div>
      </div>
    </div>
  );
}
