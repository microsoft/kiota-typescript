/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { AnonymousAuthenticationProvider, HttpMethod, RequestInformation } from "@microsoft/kiota-abstractions";
import { assert, describe, it } from "vitest";

import { FetchRequestAdapter } from "../../../src/fetchRequestAdapter";
import { FetchRequestOption, FetchRequestOptionKey } from "../../../src/middlewares/options/fetchRequestOption";

describe("FetchRequestOption", () => {
	it("Should initialize with default undefined options and correct key", () => {
		const option = new FetchRequestOption();
		assert.equal(option.getKey(), FetchRequestOptionKey);
		assert.isUndefined(option.credentials);
		assert.isUndefined(option.mode);
		assert.isUndefined(option.cache);
		assert.isUndefined(option.integrity);
		assert.isUndefined(option.keepalive);
		assert.isUndefined(option.redirect);
		assert.isUndefined(option.referrer);
		assert.isUndefined(option.referrerPolicy);
		assert.isUndefined(option.init);
	});

	it("Should initialize with provided options", () => {
		const option = new FetchRequestOption({
			credentials: "include",
			mode: "cors",
			cache: "no-cache",
			integrity: "sha256-abc",
			keepalive: true,
			redirect: "follow",
			referrer: "client",
			referrerPolicy: "no-referrer",
			init: { customOption: "customValue" },
		});
		assert.equal(option.credentials, "include");
		assert.equal(option.mode, "cors");
		assert.equal(option.cache, "no-cache");
		assert.equal(option.integrity, "sha256-abc");
		assert.isTrue(option.keepalive);
		assert.equal(option.redirect, "follow");
		assert.equal(option.referrer, "client");
		assert.equal(option.referrerPolicy, "no-referrer");
		assert.deepEqual(option.init, { customOption: "customValue" });
	});

	it("Should apply FetchRequestOption to native request in convertToNativeRequest", async () => {
		const adapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider());
		const requestInfo = new RequestInformation();
		requestInfo.URL = "https://example.com/api";
		requestInfo.httpMethod = HttpMethod.POST;
		requestInfo.content = "test body";

		const option = new FetchRequestOption({
			credentials: "include",
			mode: "cors",
			cache: "no-cache",
			keepalive: true,
			init: { customField: "hello" },
		});
		requestInfo.addRequestOptions([option]);

		const nativeRequest = await adapter.convertToNativeRequest<Record<string, unknown>>(requestInfo);
		assert.equal(nativeRequest.method, "POST");
		assert.equal(nativeRequest.credentials, "include");
		assert.equal(nativeRequest.mode, "cors");
		assert.equal(nativeRequest.cache, "no-cache");
		assert.isTrue(nativeRequest.keepalive);
		assert.equal(nativeRequest.customField, "hello");
	});

	it("Should apply adapter defaultFetchOptions when no per-request options are set", async () => {
		const defaultOptions = new FetchRequestOption({
			credentials: "include",
			mode: "same-origin",
		});
		const adapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider(), undefined, undefined, undefined, undefined, undefined, defaultOptions);

		const requestInfo = new RequestInformation();
		requestInfo.URL = "https://example.com/api";
		requestInfo.httpMethod = HttpMethod.GET;

		const nativeRequest = await adapter.convertToNativeRequest<Record<string, unknown>>(requestInfo);
		assert.equal(nativeRequest.credentials, "include");
		assert.equal(nativeRequest.mode, "same-origin");
	});

	it("Should allow per-request FetchRequestOption to override adapter defaultFetchOptions", async () => {
		const defaultOptions = new FetchRequestOption({
			credentials: "same-origin",
			mode: "same-origin",
		});
		const adapter = new FetchRequestAdapter(new AnonymousAuthenticationProvider(), undefined, undefined, undefined, undefined, undefined, defaultOptions);

		const requestInfo = new RequestInformation();
		requestInfo.URL = "https://example.com/api";
		requestInfo.httpMethod = HttpMethod.GET;
		requestInfo.addRequestOptions([
			new FetchRequestOption({
				credentials: "include",
			}),
		]);

		const nativeRequest = await adapter.convertToNativeRequest<Record<string, unknown>>(requestInfo);
		assert.equal(nativeRequest.credentials, "include"); // overridden
		assert.equal(nativeRequest.mode, "same-origin"); // preserved from default
	});
});
