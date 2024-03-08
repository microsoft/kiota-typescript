import { Headers } from "../../src";
import { assert, describe, it, beforeEach, expect } from "vitest";

/**
 * 
 * @param set1 
 * @param set2 
 * @returns 
 */
function areEqualSets<T>(set1: Set<T>, set2: Set<T>): boolean {
  if (set1.size !== set2.size) {
    return false;
  }
  for (const item of set1) {
    if (!set2.has(item)) {
      return false;
    }
  }
  return true;
}

describe('RequestHeaders', () => {
  let headers: Headers;

  beforeEach(() => {
    headers = new Headers();
  });

  it('should add a header with multiple values', () => {
    const valuesArray = ['value1', 'value2'];
    expect(headers.add('headerName', ...valuesArray)).eq(true);
    assert.isTrue(areEqualSets(headers.get('headerName')!, new Set(valuesArray)));
  });

  it('should not add a header with no values', () => {
    expect(headers.add('headerName', ...[])).eq(false);
  });

  it('should add a header with a single value if it is a singleValueHeader', () => {
    const singleValueHeader = 'Content-Type';
    const valuesArray = ['value1', 'value2'];
    expect(headers.add(singleValueHeader, ...valuesArray)).eq(true);
    assert.isTrue(areEqualSets(headers.get(singleValueHeader)!, new Set(['value1']))); // only the first value is added
  });

  it('should add values to an existing header', () => {
    headers.add('headerName', 'value1');
    expect(headers.add('headerName', 'value2')).eq(true);
    assert.isTrue(areEqualSets(headers.get('headerName')!, new Set(['value1', 'value2'])));
  });

  it('should add a header if it does not already exist when using tryAdd', () => {
    expect(headers.tryAdd('headerName', 'value1')).eq(true);
    assert.isTrue(areEqualSets(headers.get('headerName')!, new Set(['value1'])));
  });

  it('should not add a header if it already exists when using tryAdd', () => {
    headers.add('headerName', ...['value1']);
    expect(headers.tryAdd('headerName', 'value2')).eq(false);
    assert.isTrue(areEqualSets(headers.get('headerName')!, new Set(['value1'])));
  });

  it('should throw an error if tryAdd is called with an empty headerName', () => {
    expect(() => headers.tryAdd('', 'value1')).throws("headerName cannot be null or empty");
  });

  /**
   * forEach method should loop through all headers
   */
  it('should loop through all headers with forEach', () => {
    let totalKeysValue = 0;
    let totalValues = 0;
    expect(headers.add('1', '1')).eq(true);
    expect(headers.add('2', '2')).eq(true);
    expect(headers.add('3', ...['3','4'])).eq(true);
    headers.forEach((value, name) => {
      // add up all the keys
      totalKeysValue += parseInt(name);
      // add up all the values
      value.forEach(v => {
        console.log(v);
        totalValues += parseInt(v);
      });
    });
    assert.equal(totalValues, 10);
    assert.equal(totalKeysValue, 6);
  });

  it('should check if the headers is empty', () => {
    expect(headers.isEmpty()).eq(true);
    expect(headers.add('header', 'value')).eq(true);
    expect(headers.isEmpty()).eq(false);
  });

  it('should be able to delete a header value', () => {
    expect(headers.isEmpty()).eq(true);
    expect(headers.add('header', 'value')).eq(true);
    expect(headers.isEmpty()).eq(false);
    expect(headers.delete('header')).eq(true);
    expect(headers.isEmpty()).eq(true);
  });

  it('should add all headers from another Headers instance', () => {
    const otherHeaders = new Headers();
    otherHeaders.add('header1', 'value1');
    otherHeaders.add('header2', 'value2');
    headers.addAll(otherHeaders);
    assert.isTrue(areEqualSets(headers.get('header1')!, new Set(['value1'])));
    assert.isTrue(areEqualSets(headers.get('header2')!, new Set(['value2'])));
  });

  it('should merge values for headers that exist in both instances', () => {
    headers.add('header1', 'value1');
    const otherHeaders = new Headers();
    otherHeaders.add('header1', 'value2');
    headers.addAll(otherHeaders);
    assert.isTrue(areEqualSets(headers.get('header1')!, new Set(['value1', 'value2'])));
  });

  it('should return a string representation of the headers', () => {
    headers.add('header1', 'value1');
    headers.add('header2', 'value2');
    const headersString = headers.toString();
    expect(headersString).eq('{"header1":["value1"],"header2":["value2"]}');
  });

  it('should return an empty object string if there are no headers', () => {
    const headersString = headers.toString();
    expect(headersString).eq('{}');
  });

  it('should return an iterator over the keys of the headers', () => {
    headers.add('header1', 'value1');
    headers.add('header2', 'value2');
    const keysIterator = headers.keys();
    const keysArray = Array.from(keysIterator);
    expect(JSON.stringify(keysArray)).eq(JSON.stringify(['header1', 'header2']));
  });

  it('should return an empty iterator if there are no headers', () => {
    const keysIterator = headers.keys();
    const keysArray = Array.from(keysIterator);
    expect(JSON.stringify(keysArray)).eq(JSON.stringify([]));
  });

  it('should return an iterator over the entries of the headers', () => {
    headers.add('header1', 'value1');
    headers.add('header2', 'value2');

    const entriesIterator = headers.entries();
    const entriesArray = Array.from(entriesIterator);

    expect(JSON.stringify(entriesArray)).eq(JSON.stringify([
      ['header1', new Set(['value1'])],
      ['header2', new Set(['value2'])]
    ]));
  });

  it('should return an empty iterator if there are no headers', () => {
    const entriesIterator = headers.entries();
    const entriesArray = Array.from(entriesIterator);
    expect(JSON.stringify(entriesArray)).eq(JSON.stringify([]));
  });
  
  it('should initialize without entries', () => {
    const headers = new Headers();
    assert.isDefined(headers);
  });

  it('should initialize with entries', () => {
    const entries: [string, Set<string>][] = [
      ['header1', new Set(['value1'])],
      ['header2', new Set(['value2', 'value3'])]
    ];
    const headers = new Headers(entries);
    assert.isDefined(headers);
    expect(JSON.stringify(Array.from(headers.entries()))).eq(JSON.stringify(entries));
  });

  it('should ignore null entries', () => {
    const headers = new Headers(null);
    assert.isDefined(headers);
    expect(JSON.stringify(Array.from(headers.entries()))).eq(JSON.stringify([]));
  });
});