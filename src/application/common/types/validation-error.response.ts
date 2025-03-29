export interface ValidationErrorResponse {
  statusCode: number;
  message: string;
  errors: {
    field: string;
    messages: string[];
  }[];
}
