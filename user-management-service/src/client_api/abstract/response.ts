export interface AbstractResponse {
  transformToJsonWithStatus: (status: number, data: any) => void;
}