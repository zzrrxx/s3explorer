export interface ApiError {
  code: number;
  message: string;
}

export function isApiError(data: any): data is ApiError {
  return (
    data !== null &&
    typeof data === 'object' &&
    typeof data.code === 'number' &&
    typeof data.message === 'string'
  );
}
