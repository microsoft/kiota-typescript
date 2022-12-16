import { assert } from "chai";

import { FormSerializationWriterFactory } from "../../src/index";

describe("formSerializationWriterFactory", () => {
  it("formSerializationWriterFactory", () => {
    const factory = new FormSerializationWriterFactory();
    assert.isDefined(factory);
  });
  it("formSerializationWriterFactory:getsWriterForFormContentType", () => {
    const factory = new FormSerializationWriterFactory();

    const formParseNode = factory.getSerializationWriter(
      factory.getValidContentType()
    );
    assert.isDefined(formParseNode);
  });
  it("formSerializationWriterFactory:throwsForInvalidContentType", () => {
    const factory = new FormSerializationWriterFactory();

    assert.throw(() => factory.getSerializationWriter("application/json"));
  });
  it("formSerializationWriterFactory:throwsForNoContentType", () => {
    const factory = new FormSerializationWriterFactory();

    assert.throw(() => factory.getSerializationWriter(""));
  });
});
