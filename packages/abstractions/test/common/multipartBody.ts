import { assert } from "chai";

import { MultipartBody, serializeMultipartBody } from "../../src/multipartBody";
import { SerializationWriter } from "../../src/serialization";
describe("multipartBody", () => {
  it("implements defensive programming", () => {
    const mpBody = new MultipartBody();
    assert.throws(
      () => mpBody.addOrReplacePart("", "application/json", "test"),
      Error,
      "partName cannot be undefined",
    );
    assert.throws(
      () => mpBody.addOrReplacePart("test", "", "test"),
      Error,
      "partContentType cannot be undefined",
    );
    assert.throws(
      () => mpBody.addOrReplacePart("test", "application/json", ""),
      Error,
      "content cannot be undefined",
    );
    assert.throws(
      () => mpBody.getPartValue(""),
      Error,
      "partName cannot be undefined",
    );
    assert.throws(
      () => mpBody.removePart(""),
      Error,
      "partName cannot be undefined",
    );
    assert.throws(
      () =>
        serializeMultipartBody(undefined as any as SerializationWriter, mpBody),
      Error,
      "writer cannot be undefined",
    );
    assert.throws(
      () =>
        serializeMultipartBody(
          {} as any as SerializationWriter,
          undefined as any as MultipartBody,
        ),
      Error,
      "multipartBody cannot be undefined",
    );
  });
  it("requires parts for serialization", () => {
    const mpBody = new MultipartBody();
    assert.throws(
      () => serializeMultipartBody({} as any as SerializationWriter, mpBody),
      Error,
      "multipartBody cannot be empty",
    );
  });
  it("adds parts", () => {
    const mpBody = new MultipartBody();
    mpBody.addOrReplacePart("test", "application/json", "test");
    assert.strictEqual(mpBody.getPartValue("test"), "test");
    mpBody.addOrReplacePart("test", "application/json", "test2");
    assert.strictEqual(mpBody.getPartValue("test"), "test2");
  });
  it("removes parts", () => {
    const mpBody = new MultipartBody();
    mpBody.addOrReplacePart("test", "application/json", "test");
    assert.strictEqual(mpBody.getPartValue("test"), "test");
    mpBody.removePart("test");
    assert.strictEqual(mpBody.getPartValue("test"), undefined);
  });
  //serialize method is tested in the serialization library
});
