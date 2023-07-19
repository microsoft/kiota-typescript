/**
 * A Proxy that allows implementation of a Object with case insensitive keys
 * @param canon A function that takes a property name and returns its canonical form.
 * @returns A new object that can be used as a dictionary with case-insensitive keys.
 */
function dictionaryWithCanonicalKeys<V>(canon: (prop: keyof any) => keyof any) {
  return new Proxy<{ [k: string]: V }>(
    {},
    {
      /**
      * Intercept the get operation on the dictionary object and forward it to the target object using Reflect.get.
      */
      get(target, prop) {
        return Reflect.get(target, canon(prop));
      },
      /**
      * Intercept the set operation on the dictionary object and forward it to the target object using Reflect.set.
      */
      set(target, prop, value) {
        return Reflect.set(target, canon(prop), value);
      },
      /**
      * Intercept the has operation on the dictionary object and forward it to the target object using Reflect.has.
      */
      has(target, prop) {
        return Reflect.has(target, canon(prop));
      },
      /**
      * Intercept the defineProperty operation on the dictionary object and forward it to the target object using Reflect.defineProperty.
      */
      defineProperty(target, prop, attribs) {
        return Reflect.defineProperty(target, canon(prop), attribs);
      },
      /**
      * Intercept the deleteProperty operation on the dictionary object and forward it to the target object using Reflect.deleteProperty.
      */
      deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, canon(prop));
      },
      /**
      * Intercept the getOwnPropertyDescriptor operation on the dictionary object and forward it to the target object using Reflect.getOwnPropertyDescriptor.
      */
      getOwnPropertyDescriptor(target, prop) {
        return Reflect.getOwnPropertyDescriptor(target, canon(prop));
      }
    }
  );
}

/**
* A wrapper for type Record that creates a Record with case insensitive keys
* @returns A new object that can be used as a dictionary with case-insensitive keys.
*/
export function createRecordWithCaseInsensitiveKeys<T>(): Record<string, T> {
  /**
  * A function that takes a property name and returns its canonical form.
  * @param prop The property name to be canonicalized.
  * @returns The canonical form of the property name.
  */
  const record: Record<string, T> = dictionaryWithCanonicalKeys<T>(
    p => (typeof p === "string" ? p.toLowerCase() : p)
  );
  return record;
}