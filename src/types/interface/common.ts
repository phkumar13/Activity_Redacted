export interface LogOptions {
  statusCode?: number;
  'x-correlation-id'?: string;
  destination: string;
  reasonCode?: string;
}
