/** Parent interface for errors thrown by the client when receiving failed responses to its requests. */
export interface ApiError extends Error {
  /** The status code for the error. */
  responseStatusCode: number | undefined;

  /** The Response Headers. */
  responseHeaders: Record<string, string[]> | undefined;
}
/** Default error type used when no error mapping is registered for the status code */
export class DefaultApiError extends Error implements ApiError {
  public constructor(message?: string) {
    super(message);
  }
  public responseStatusCode: number | undefined;
  public responseHeaders: Record<string, string[]> | undefined = {};
}
