export enum SerializedScopeTypes {
  Day,
  Week,
}

export interface SerializedLog {
  summaryContents?: string;
  rawPath?: string;
  appPath?: string;
  chronoPath?: string;
  date: Date;
  scope: SerializedScopeTypes;
}
