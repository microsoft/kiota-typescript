/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { AnonymousAuthenticationProvider, AuthenticationProvider, ParseNodeFactoryRegistry, SerializationWriterFactoryRegistry } from "@microsoft/kiota-abstractions";
import { assert, describe, it } from "vitest";

import { DefaultRequestAdapter } from "../src/defaultRequestAdapter";


describe("defaultRequestAdapter.ts", () => {
  describe("Initialization", () => {
    it("should throw error on null authProvider", async () => {
      assert.throws(() => new DefaultRequestAdapter(null as unknown as AuthenticationProvider), Error, "authentication provider cannot be null");
    });

    it("should setup serializers correctly", async () => {
      const requestAdapter = new DefaultRequestAdapter(new AnonymousAuthenticationProvider());

      assert.isNotNull(requestAdapter);

      const serializerMap = SerializationWriterFactoryRegistry.defaultInstance.contentTypeAssociatedFactories;
      const deserializerMap = ParseNodeFactoryRegistry.defaultInstance.contentTypeAssociatedFactories;

      assert.isNotNull(serializerMap);
      assert.isNotNull(deserializerMap);

      // verify that the default serializers are registered
      assert.equal(serializerMap.size, 4);
      assert.equal(deserializerMap.size, 3);

      // verify that the default serializers are registered by name
      assert.isTrue(serializerMap.has("application/json"));
      assert.isTrue(serializerMap.has("text/plain"));
      assert.isTrue(serializerMap.has("application/x-www-form-urlencoded"));
      assert.isTrue(serializerMap.has("multipart/form-data"));

      // verify that the default deserializers are registered by name
      assert.isTrue(deserializerMap.has("application/json"));
      assert.isTrue(deserializerMap.has("text/plain"));
      assert.isTrue(deserializerMap.has("application/x-www-form-urlencoded"));

    });
  });
});
