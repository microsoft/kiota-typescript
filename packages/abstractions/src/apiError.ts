/** Parent interface for errors thrown by the client when receiving failed responses to its requests. */
export class ApiError extends Error {
  public constructor(message?: string) {
    super(message);
  }

  /** The status code for the error. */
  public responseStatusCode?: number;

  /** The Response Headers. */
  public responseHeaders: Record<string, string[]> = {};
}
