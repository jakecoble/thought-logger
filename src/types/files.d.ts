export enum SerializedScopeTypes {
  Day,
  Week,
}

// FIXME merge with the similar LogFileInfo
export interface SerializedLog {
  summaryContents?: string;
  rawPath?: string;
  appPath?: string;
  chronoPath?: string;
  date: Date;
  scope: SerializedScopeTypes;
}
