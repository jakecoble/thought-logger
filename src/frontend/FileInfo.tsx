import React, { useEffect, useState, useCallback } from "react";
import { groupBy } from "lodash";

function openFolder() {
  window.userData.openUserDataFolder();
}

const isAiSummary = (file: string) => file.includes("aisummary");

const getFileName = (file: string) => {
  const parts = file.split("/").slice(-1)[0].split(".");
  if (isAiSummary(file)) return "ai summary";
  return parts.slice(1, 3).join(".");
};

function getMonth(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function getWeek(dateStr: string) {
  const d = new Date(dateStr);
  // Get Monday of the week
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return `${monday.getFullYear()}-W${String(getWeekNumber(monday)).padStart(2, "0")}`;
}

function getWeekNumber(d: Date) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil(
    (((d as any) - (yearStart as any)) / 86400000 + 1) / 7,
  );
  return weekNo;
}

export function FileInfo() {
  const [dataFolder, setDataFolder] = useState("(loading)");
  const [filesByDate, setFilesByDate] = useState<Record<string, string[]>>({});
  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  useEffect(() => {
    window.userData.getUserDataFolder().then(setDataFolder);
    window.userData.listRecentFiles().then((files) => {
      // Filter files from the past year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const filteredFiles = files.filter((file) => {
        const dateStr = file.split("/").slice(-1)[0].split(".")[0];
        const fileDate = new Date(dateStr);
        return !isNaN(fileDate.getTime()) && fileDate >= oneYearAgo;
      });
      setFilesByDate(
        groupBy(
          filteredFiles,
          (file) => file.split("/").slice(-1)[0].split(".")[0],
        ),
      );
    });
  }, []);

  useEffect(() => {
    const allFiles = Object.values(filesByDate).flat();
    Promise.all(
      allFiles.map((file) =>
        file in fileContents
          ? Promise.resolve()
          : window.userData
              .readFile(file)
              .then((content) =>
                setFileContents((prev) => ({ ...prev, [file]: content })),
              )
              .catch(() =>
                setFileContents((prev) => ({
                  ...prev,
                  [file]: "(error loading file)",
                })),
              ),
      ),
    );
  }, [filesByDate]);

  const getFormattedFile = (file: string) => {
    const content = fileContents[file];
    if (!content) return "Loading...";
    if (!content.match(/1\. /)) {
      return content;
    }
    const newContent = "1. " + content.split("1.")[1];
    const paragraphs = newContent.split(/\n\s*\n/);
    // Check if the last paragraph starts with a number
    const last = paragraphs[paragraphs.length - 1];
    if (last && !/^\d/.test(last.trim())) {
      paragraphs.pop();
    }
    return paragraphs.join("\n\n");
  };

  // Group dates by month and week
  const tocByMonth: Record<string, Record<string, string[]>> = {};
  Object.keys(filesByDate).forEach((dateStr) => {
    const month = getMonth(dateStr);
    const week = getWeek(dateStr);
    if (!tocByMonth[month]) tocByMonth[month] = {};
    if (!tocByMonth[month][week]) tocByMonth[month][week] = [];
    tocByMonth[month][week].push(dateStr);
  });

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
          onClick={(e) => {
            e.preventDefault();
            window.userData.openExternalUrl("http://localhost:8765/today");
          }}
          className="text-blue-600 no-underline cursor-pointer"
        >
          today
        </a>
        <a
          href="http://localhost:8765/yesterday"
          onClick={(e) => {
            e.preventDefault();
            window.userData.openExternalUrl("http://localhost:8765/yesterday");
          }}
          className="text-blue-600 no-underline cursor-pointer"
        >
          yesterday
        </a>
        <a
          href="http://localhost:8765/last7days"
          onClick={(e) => {
            e.preventDefault();
            window.userData.openExternalUrl("http://localhost:8765/week");
          }}
          className="text-blue-600 no-underline cursor-pointer"
        >
          week
        </a>
      </div>

      <div className="flex gap-5 mt-5">
        <div
          className="min-w-[220px] max-w-[250px] pr-2 border-r border-gray-200 text-sm"
          style={{ maxHeight: 600, overflowY: "auto" }}
        >
          <div className="font-bold mb-2">Table of Contents</div>
          {Object.entries(tocByMonth).map(([month, weeks]) => (
            <div key={month} className="mb-2">
              <div className="font-semibold">{month}</div>
              <div style={{ marginLeft: 10 }}>
                {Object.entries(weeks).map(([week, days]) => (
                  <div key={week} className="mb-1">
                    <div className="text-xs text-gray-600">
                      <a
                        href={`#week-${week}`}
                        className="text-blue-500 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(`week-${week}`);
                          if (el)
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                        }}
                      >
                        {week}
                      </a>
                    </div>
                    <div style={{ marginLeft: 10 }}>
                      {days
                        .sort((a, b) => b.localeCompare(a))
                        .map((day) => (
                          <div key={day}>
                            <a
                              href={`#day-${day}`}
                              className="text-blue-700 hover:underline"
                              style={{ fontSize: 13 }}
                              onClick={(e) => {
                                e.preventDefault();
                                const el = document.getElementById(
                                  `day-${day}`,
                                );
                                if (el)
                                  el.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });
                              }}
                            >
                              {new Date(day).toLocaleDateString("en-US", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="min-w-[300px] flex-1">
          {(() => {
            // Flatten and sort all dates descending
            const allDates = Object.keys(filesByDate).sort((a, b) =>
              b.localeCompare(a),
            );
            const result: React.ReactNode[] = [];
            allDates.forEach((date, idx) => {
              const files = filesByDate[date];
              const week = getWeek(date);
              // Render the day as before
              result.push(
                <div key={date} className="mb-2.5" id={`day-${date}`}>
                  <div className="mb-1 font-bold flex items-center">
                    <span className="mr-auto">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded ml-2 px-2 py-0.5 text-xs"
                      onClick={() => {
                        const rawFile = files.find(
                          (f) => !isAiSummary(f) && !f.includes(".processed."),
                        );
                        window.userData.generateAISummary(rawFile);
                      }}
                    >
                      regenerate summary
                    </button>
                    {files.find(
                      (f) => !isAiSummary(f) && !f.includes(".processed."),
                    ) && (
                      <button
                        className="ml-2 px-2 py-2 text-xs text-blue-800 font-normal"
                        onClick={() =>
                          window.userData.openExternalUrl(
                            `file://${files.find((f) => !isAiSummary(f) && !f.includes(".processed."))}`,
                          )
                        }
                      >
                        raw
                      </button>
                    )}
                    {files
                      .filter(
                        (f) => !isAiSummary(f) && f.includes(".processed."),
                      )
                      .map((f) => (
                        <button
                          key={f}
                          className="ml-2 px-2 py-0.5 text-xs text-green-800 font-normal"
                          onClick={() =>
                            window.userData.openExternalUrl(`file://${f}`)
                          }
                        >
                          {f.split(".").slice(1, 3).join(".")}
                        </button>
                      ))}
                  </div>
                  <div className="flex flex-col gap-1">
                    {files
                      .sort((a, b) =>
                        isAiSummary(a) === isAiSummary(b)
                          ? a.localeCompare(b)
                          : isAiSummary(a)
                            ? -1
                            : 1,
                      )
                      .map((file) => {
                        if (isAiSummary(file)) {
                          return (
                            <div
                              key={file}
                              className="whitespace-pre-wrap bg-gray-100 p-3 rounded text-sm"
                            >
                              {getFormattedFile(file)}
                            </div>
                          );
                        }
                      })}
                  </div>
                </div>,
              );
              // If this is the last day of the week (Sunday or last date or week changes), render the week summary
              const isSunday = new Date(date).getDay() === 0;
              const isLast = idx === allDates.length - 1;
              const nextWeek = !isLast ? getWeek(allDates[idx + 1]) : null;
              if (isSunday || isLast || nextWeek !== week) {
                result.push(
                  <div
                    key={`week-title-${week}`}
                    id={`week-${week}`}
                    className="font-semibold text-3xl text-base mt-4 mb-2 mt-10"
                  >
                    Week of{" "}
                    {(() => {
                      // Find the Monday of this week
                      const d = new Date(date);
                      d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
                      return d.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });
                    })()}
                  </div>,
                );
              }
            });
            return result;
          })()}
        </div>
      </div>
    </div>
  );
}
