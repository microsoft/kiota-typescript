import { Parsable, ParsableFactory, ParseNode } from "../../../src/serialization";
import { isBackingStoreEnabled } from "../../../src/store/backingStoreUtils";

interface Person {
  name: string;
  age: number;
}

// const personFactory: ParsableFactory<Person> = (node: ParseNode) => (obj: Person) => ({
//   name: node.getString(obj.name),
//   age: node.getNumber(obj.age),
// });

// describe('isBackingStoreEnabled', () => {
//   it('should return true if the object has a backingStore property', () => {
//     const person: Person = { name: 'John', age: 30 };
//     const result = isBackingStoreEnabled(person, personFactory);
//     expect(result).toBe(true);
//   });

//   it('should return false if the object does not have a backingStore property', () => {
//     const person: Person = { name: 'John', age: 30 };
//     delete person[Symbol.for('backingStore')];
//     const result = isBackingStoreEnabled(person, personFactory);
//     expect(result).toBe(false);
//   });

//   it('should return false if the object is not a Parsable', () => {
//     const obj = { foo: 'bar' };
//     const result = isBackingStoreEnabled(obj as Parsable, personFactory);
//     expect(result).toBe(false);
//   });

//   it('should return false if the object is null or undefined', () => {
//     const result1 = isBackingStoreEnabled(null, personFactory);
//     expect(result1).toBe(false);

//     const result2 = isBackingStoreEnabled(undefined, personFactory);
//     expect(result2).toBe(false);
//   });
// });