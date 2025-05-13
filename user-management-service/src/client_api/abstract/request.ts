export interface AbstractRequest {
  params: Record<string, string>;
  body: Record<string, unknown>;
}