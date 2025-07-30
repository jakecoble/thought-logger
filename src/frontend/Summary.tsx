import React, { ReactElement } from "react";
import { format } from "date-fns";
import { SerializedLog, SerializedScopeTypes } from "../types/files.d";

const getFormattedFile = (content: string): string => {
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

export default function Summary({ log }: { log: SerializedLog }): ReactElement {
  const date = log.date;
  const dateStr = format(date, "yyyy-MM-dd");
  return (
    <div key={dateStr} className="mb-2.5" id={`day-${dateStr}`}>
      <div className="mb-1 font-bold flex items-center">
        <span className="mr-auto">
          {log.scope === SerializedScopeTypes.Week && "Week of "}
          {date.toLocaleDateString("en-US", {
            weekday:
              log.scope === SerializedScopeTypes.Day ? "long" : undefined,
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          className={
            (log.loading
              ? "bg-gray-300 opacity-50 cursor-not-allowed "
              : "bg-blue-500 hover:bg-blue-700 ") +
            "text-white font-bold rounded ml-2 px-2 py-0.5 text-xs"
          }
          onClick={() => window.userData.generateAISummary(log)}
          disabled={log.loading}
        >
          regenerate summary
        </button>
        {log.rawPath && (
          <button
            className="ml-2 px-2 py-2 text-xs text-blue-800 font-normal"
            onClick={() =>
              window.userData.openExternalUrl(`file://${log.rawPath}`)
            }
          >
            Raw
          </button>
        )}
        {log.appPath && (
          <button
            className="ml-2 px-2 py-0.5 text-xs text-green-800 font-normal"
            onClick={() =>
              window.userData.openExternalUrl(`file://${log.appPath}`)
            }
          >
            By App
          </button>
        )}
        {log.chronoPath && (
          <button
            className="ml-2 px-2 py-0.5 text-xs text-green-800 font-normal"
            onClick={() =>
              window.userData.openExternalUrl(`file://${log.chronoPath}`)
            }
          >
            Chronological
          </button>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="whitespace-pre-wrap bg-gray-100 p-3 rounded text-sm">
          {log.loading && "Generating a summary..."}
          {log.summaryContents &&
            !log.loading &&
            getFormattedFile(log.summaryContents)}
        </div>
      </div>
    </div>
  );
}
