import { RequestHeaders } from "../../src";
import { assert, expect } from "chai";

describe('RequestHeaders', () => {
  let headers: RequestHeaders;

  beforeEach(() => {
    headers = new RequestHeaders();
  });

  it('should add a header with multiple values', () => {
    expect(headers.add('headerName', ...['value1', 'value2'])).eq(true);
    expect(headers.get('headerName')?.toString()).eq(new Set(['value1', 'value2']).toString());
  });

  it('should not add a header with no values', () => {
    expect(headers.add('headerName', ...[])).eq(false);
  });

  it('should add a header with a single value if it is a singleValueHeader', () => {
    const singleValueHeader = 'Content-Type';
    expect(headers.add('headerName', ...['value1', 'value2'])).eq(true);
    expect(headers.get('headerName')?.toString()).eq(new Set(['value1']).toString()); // only the first value is added
  });

  it('should add values to an existing header', () => {
    headers.add('headerName', 'value1');
    expect(headers.add('headerName', 'value2')).eq(true);
    expect(headers.get('headerName')?.toString()).eq(new Set(['value1', 'value2']).toString());
  });

  it('should add a header if it does not already exist when using tryAdd', () => {
    expect(headers.tryAdd('headerName', 'value1')).eq(true);
    expect(headers.get('headerName')?.toString()).eq(new Set(['value1']).toString());
  });

  it('should not add a header if it already exists when using tryAdd', () => {
    headers.add('headerName', ...['value1']);
    expect(headers.tryAdd('headerName', 'value2')).eq(false);
    expect(headers.get('headerName')?.toString()).eq(new Set(['value1']).toString()); // value2 is not added
  });

  it('should throw an error if tryAdd is called with an empty headerName', () => {
    expect(() => headers.tryAdd('', 'value1')).throws("headerName cannot be null or empty");
  });
});