import React, { ReactElement } from "react";
import { format } from "date-fns";
import { SerializedLog, SerializedScopeTypes } from "../types/files.d";

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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded ml-2 px-2 py-0.5 text-xs"
          onClick={() => window.userData.generateAISummary(log)}
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
      {log.summaryContents && (
        <div className="flex flex-col gap-1">
          <div className="whitespace-pre-wrap bg-gray-100 p-3 rounded text-sm">
            {log.summaryContents}
          </div>
        </div>
      )}
    </div>
  );
}
