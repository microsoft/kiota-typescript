export interface BaseRequestBuilder<T> {
  withUrl(rawUrl: string): T;
}
