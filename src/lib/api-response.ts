export type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: { code: string; message: string; details?: unknown } };

export function ok<T>(data: T, message?: string): ApiResponse<T> {
  return message ? { success: true, data, message } : { success: true, data };
}

export function fail(code: string, message: string, details?: unknown): ApiResponse<never> {
  return { success: false, error: { code, message, details } };
}