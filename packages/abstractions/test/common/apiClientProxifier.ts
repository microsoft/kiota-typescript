/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it, beforeEach } from "vitest";
import { apiClientProxifier } from "../../src/apiClientProxifier";
import type { RequestAdapter } from "../../src/requestAdapter";

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
