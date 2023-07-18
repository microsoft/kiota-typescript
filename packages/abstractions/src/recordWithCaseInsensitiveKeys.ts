/**
 * A Proxy that allows implementation of a Object with case insensitive keys
 * @param canon 
 * @returns 
 */
function dictionaryWithCanonicalKeys<V>(canon: (prop: keyof any) => keyof any) {
  return new Proxy<{ [k: string]: V }>(
    {},
    {
      get(target, prop) {
        return Reflect.get(target, canon(prop));
      },
      set(target, prop, value) {
        return Reflect.set(target, canon(prop), value);
      },
      has(target, prop) {
        return Reflect.has(target, canon(prop));
      },
      defineProperty(target, prop, attribs) {
        return Reflect.defineProperty(target, canon(prop), attribs);
      },
      deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, canon(prop));
      },
      getOwnPropertyDescriptor(target, prop) {
        return Reflect.getOwnPropertyDescriptor(target, canon(prop));
      }
    }
  );
}
/**
 * A wrapper for type Record that creates a Record with case insensitive keys
 * @param obj 
 * @returns 
 */
export function createRecordWithCaseInsensitiveKeys<T>(obj: Record<string, T>): Record<string, T> {
  const record: Record<string, T> = dictionaryWithCanonicalKeys<T>(
    p => (typeof p === "string" ? p.toLowerCase() : p)
  );
  return record;
}