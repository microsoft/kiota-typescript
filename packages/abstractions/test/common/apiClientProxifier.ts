/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it, beforeEach, vi } from "vitest";
import { apiClientProxifier } from "../../src/apiClientProxifier";
import type { RequestAdapter } from "../../src/requestAdapter";
import type { RequestInformation } from "../../src/requestInformation";
import type { SerializationWriterFactory } from "../../src/serialization";

// Mock RequestAdapter for testing
class MockRequestAdapter implements RequestAdapter {
	public baseUrl = "https://example.com";
	public send = () => Promise.resolve({});
	public sendCollection = () => Promise.resolve([]);
	public sendEnum = () => Promise.resolve({});
	public sendCollectionOfEnum = () => Promise.resolve([]);
	public sendCollectionOfPrimitive = () => Promise.resolve([]);
	public sendPrimitive = () => Promise.resolve({});
	public sendNoResponseContent = () => Promise.resolve();
	public enableBackingStore = () => {};
	public getSerializationWriterFactory = () => ({}) as any;
	public convertToNativeRequest = () => Promise.resolve({} as any);
}

describe("apiClientProxifier", () => {
	let requestAdapter: RequestAdapter;
	let pathParameters: Record<string, unknown>;

	beforeEach(() => {
		requestAdapter = new MockRequestAdapter();
		pathParameters = { baseurl: "https://graph.microsoft.com/v1.0" };
	});

	it.each([false, 0, "", true, 1, "some content"])("preserves scalar body %j through the proxy", async (value) => {
		const writeValue = vi.fn();
		const writer = {
			writeBooleanValue: writeValue,
			writeNumberValue: writeValue,
			writeStringValue: writeValue,
			writeNullValue: () => assert.fail("Expected the scalar value to be preserved"),
			getSerializedContent: () => new TextEncoder().encode(JSON.stringify(value)).buffer,
		};
		requestAdapter.getSerializationWriterFactory = () => ({ getSerializationWriter: () => writer }) as unknown as SerializationWriterFactory;
		const send = vi.fn(() => Promise.resolve());
		requestAdapter.sendNoResponseContent = send;
		const proxy = apiClientProxifier<{
			toPostRequestInformation: (body: string | number | boolean) => RequestInformation;
			post: (body: string | number | boolean) => Promise<void>;
		}>(requestAdapter, pathParameters, undefined, {
			post: {
				uriTemplate: "{+baseurl}/scalar",
				requestBodySerializer: typeof value as "string" | "number" | "boolean",
				requestBodyContentType: "application/json",
				adapterMethodName: "sendNoResponseContent",
			},
		});

		const request = proxy.toPostRequestInformation(value);
		assert.deepEqual(writeValue.mock.calls, [[undefined, value]]);
		assert.equal(new TextDecoder().decode(request.content), JSON.stringify(value));
		await proxy.post(value);
		assert.deepEqual(writeValue.mock.calls, [
			[undefined, value],
			[undefined, value],
		]);
		assert.equal(send.mock.calls.length, 1);
	});

	it.each([null, undefined])("rejects missing scalar body %s through the proxy", (value) => {
		const proxy = apiClientProxifier<{ toPostRequestInformation: (body?: unknown) => RequestInformation }>(requestAdapter, pathParameters, undefined, {
			post: {
				uriTemplate: "{+baseurl}/scalar",
				requestBodySerializer: "string",
				requestBodyContentType: "application/json",
			},
		});
		assert.throws(() => proxy.toPostRequestInformation(value), "body cannot be undefined");
	});

	it("dispatches QUERY requests through the proxy", async () => {
		const send = vi.fn((_: RequestInformation) => Promise.resolve());
		requestAdapter.sendNoResponseContent = send;
		const proxy = apiClientProxifier<{
			toQueryRequestInformation: () => RequestInformation;
			query: () => Promise<void>;
		}>(requestAdapter, pathParameters, undefined, {
			query: {
				uriTemplate: "{+baseurl}/search",
				adapterMethodName: "sendNoResponseContent",
			},
		});

		assert.equal(proxy.toQueryRequestInformation().httpMethod, "QUERY");
		await proxy.query();
		assert.equal(send.mock.calls[0][0].httpMethod, "QUERY");
	});

	describe("then property handling", () => {
		it("should return undefined when accessing 'then' property", () => {
			const navigationMetadata = {
				users: {
					requestsMetadata: {
						get: {
							uriTemplate: "{+baseurl}/users",
							adapterMethodName: "sendCollection" as const,
						},
					},
				},
			};

			const proxy = apiClientProxifier(requestAdapter, pathParameters, navigationMetadata);

			// Access the 'then' property - this should return undefined
			const thenProperty = (proxy as any).then;

			assert.isUndefined(thenProperty);
		});

		it("should not throw error when accessing 'then' property with navigation metadata", () => {
			const navigationMetadata = {
				users: {
					requestsMetadata: {
						get: {
							uriTemplate: "{+baseurl}/users",
							adapterMethodName: "sendCollection" as const,
						},
					},
				},
			};

			const proxy = apiClientProxifier(requestAdapter, pathParameters, navigationMetadata);

			// This should not throw an error
			assert.doesNotThrow(() => {
				const thenProperty = (proxy as any).then;
				return thenProperty;
			});
		});

		it("should still throw error for unknown navigation properties other than 'then'", () => {
			const navigationMetadata = {
				users: {
					requestsMetadata: {
						get: {
							uriTemplate: "{+baseurl}/users",
							adapterMethodName: "sendCollection" as const,
						},
					},
				},
			};

			const proxy = apiClientProxifier(requestAdapter, pathParameters, navigationMetadata);

			assert.throws(
				() => {
					// Accessing an unknown property should still throw
					(proxy as any).unknownProperty;
				},
				Error,
				"couldn't find navigation property unknownProperty",
			);
		});
	});
});
