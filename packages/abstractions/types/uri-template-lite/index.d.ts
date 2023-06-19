declare module 'uri-template-lite' {
  function expand(template: string, data: { [key: string]: unknown }): string;
}
