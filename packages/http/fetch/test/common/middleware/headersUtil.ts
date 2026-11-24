/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
/* eslint-disable @typescript-eslint/no-unused-vars*/

import { assert, describe, it } from "vitest";

import type { FetchRequestInit } from "../../../src/utils/fetchDefinitions";
import { appendRequestHeader, deleteRequestHeader, getRequestHeader, setRequestHeader } from "../../../src/utils/headersUtil";

describe("HeaderUtil", async () => {
	describe("getRequestHeader", () => {
		const value = "application/json";
		const url = "dummy_url";

		it("Should get header from headers object", () => {
			const options: FetchRequestInit = {
				method: "test",
				headers: {
					version: "version",
					"Content-Type": value,
				},
			};
			const headerValue: string = getRequestHeader(options, "Content-Type");
			const headerVersion: string = getRequestHeader(options, "version");
			assert.equal(headerValue, value);
			assert.equal(headerVersion, "version");
		});

		it("Should get header from record of headers", () => {
			const options: FetchRequestInit = {
				method: "test",
				headers: {
					version: "version",
					"Content-Type": value,
				},
			};
			const headerValue: string = getRequestHeader(options, "Content-Type");
			const headerVersion: string = getRequestHeader(options, "version");
			assert.equal(headerValue, value);
			assert.equal(headerVersion, "version");
		});

		it("Should get header case-insensitively from record of headers", () => {
			const options: FetchRequestInit = {
				method: "GET",
				headers: {
					"content-type": value,
					authorization: "Bearer token",
				},
			};
			assert.equal(getRequestHeader(options, "Content-Type"), value);
			assert.equal(getRequestHeader(options, "AUTHORIZATION"), "Bearer token");
		});

		it("Should ignore Object.prototype properties on plain records", () => {
			const options: FetchRequestInit = {
				method: "GET",
				headers: {},
			};
			assert.isUndefined(getRequestHeader(options, "toString"));
			assert.isUndefined(getRequestHeader(options, "constructor"));
			assert.isUndefined(getRequestHeader(options, ""));
			assert.isUndefined(getRequestHeader(undefined, "Content-Type"));
		});

		it("Should get header from Headers instance", () => {
			const options: RequestInit = {
				method: "GET",
				headers: new Headers({ "Content-Type": value }),
			};
			assert.equal(getRequestHeader(options, "content-type"), value);
			assert.equal(getRequestHeader(options, "Content-Type"), value);
			assert.isUndefined(getRequestHeader(options, "X-Missing"));
		});

		it("Should get header case-insensitively from tuple array and join duplicates", () => {
			const options: RequestInit = {
				method: "GET",
				headers: [
					["x-custom", "first"],
					["X-Custom", "second"],
					["Content-Type", value],
				],
			};
			assert.equal(getRequestHeader(options, "content-type"), value);
			assert.equal(getRequestHeader(options, "X-CUSTOM"), "first, second");
			assert.isUndefined(getRequestHeader(options, "X-Missing"));
		});

		it("Should get header case-insensitively from record and join duplicates with different casings", () => {
			const options: FetchRequestInit = {
				method: "GET",
				headers: {
					"Content-Encoding": "",
					"content-encoding": "br",
					Accept: "text/html",
					accept: "application/json",
				},
			};
			assert.equal(getRequestHeader(options, "Content-Encoding"), ", br");
			assert.equal(getRequestHeader(options, "content-encoding"), ", br");
			assert.equal(getRequestHeader(options, "CONTENT-ENCODING"), ", br");
			assert.equal(getRequestHeader(options, "accept"), "text/html, application/json");
			assert.equal(getRequestHeader(options, "Accept"), "text/html, application/json");
		});
	});

	describe("setRequestHeader", () => {
		const key = "Content-Type";
		const value = "application/json";
		const url = "dummy_url";

		it("Should set header for undefined headers", () => {
			const options: FetchRequestInit = {
				method: "test",
			};
			setRequestHeader(options, key, value);
			assert.isDefined(options.headers);
			assert.equal(options.headers[key], value);
		});

		it("Should set header for empty headers", () => {
			const options: FetchRequestInit = {
				method: "test",
				headers: {},
			};
			setRequestHeader(options, key, value);
			assert.isDefined(options.headers);
			assert.equal(options.headers[key], value);
		});

		it("Should set header in headers object", () => {
			const options: FetchRequestInit = {
				method: "test",
				headers: {
					version: "version",
				},
			};
			setRequestHeader(options, key, value);
			assert.equal(options.headers[key], value);
		});

		it("Should replace header in headers object if header is already present", () => {
			const options: FetchRequestInit = {
				method: "test",
				headers: {
					version: "version",
					[key]: value,
				},
			};
			setRequestHeader(options, key, value);
			assert.equal(options.headers[key], value);
		});

		it("Should replace mismatched-case header in record without creating duplicates", () => {
			const options: FetchRequestInit = {
				method: "POST",
				headers: {
					"content-type": "text/plain",
				},
			};
			setRequestHeader(options, "Content-Type", value);
			assert.equal(options.headers?.["Content-Type"], value);
			assert.isUndefined(options.headers?.["content-type"]);
			assert.deepEqual(Object.keys(options.headers ?? {}), ["Content-Type"]);
		});

		it("Should set header on Headers instance", () => {
			const headers = new Headers({ "content-type": "text/plain" });
			const options: RequestInit = { method: "POST", headers };
			setRequestHeader(options, "Content-Type", value);
			assert.equal(headers.get("Content-Type"), value);
		});

		it("Should set and deduplicate header on tuple array", () => {
			const headers: [string, string][] = [
				["content-type", "text/plain"],
				["Accept", "*/*"],
				["CONTENT-TYPE", "text/html"],
			];
			const options: RequestInit = { method: "POST", headers };
			setRequestHeader(options, "Content-Type", value);
			assert.deepEqual(headers, [
				["Content-Type", value],
				["Accept", "*/*"],
			]);
		});
	});

	describe("deleteRequestHeader", () => {
		it("Should delete header case-insensitively from record", () => {
			const options: FetchRequestInit = {
				method: "POST",
				headers: {
					"content-encoding": "gzip",
					Accept: "application/json",
				},
			};
			deleteRequestHeader(options, "Content-Encoding");
			assert.deepEqual(options.headers, { Accept: "application/json" });
		});

		it("Should be a no-op when headers are undefined", () => {
			const options: FetchRequestInit = { method: "GET" };
			deleteRequestHeader(options, "Content-Encoding");
			assert.isUndefined(options.headers);
		});

		it("Should delete header from Headers instance", () => {
			const headers = new Headers({ "Content-Encoding": "gzip", Accept: "application/json" });
			const options: RequestInit = { method: "POST", headers };
			deleteRequestHeader(options, "content-encoding");
			assert.isNull(headers.get("Content-Encoding"));
			assert.equal(headers.get("Accept"), "application/json");
		});

		it("Should delete all matching entries from tuple array", () => {
			const headers: [string, string][] = [
				["content-encoding", "gzip"],
				["Accept", "application/json"],
				["Content-Encoding", "br"],
			];
			const options: RequestInit = { method: "POST", headers };
			deleteRequestHeader(options, "Content-Encoding");
			assert.deepEqual(headers, [["Accept", "application/json"]]);
		});
	});

	describe("appendRequestHeader", () => {
		const key = "Content-Type";
		const value = "application/json";
		const firstValue = "text/html";
		const url = "dummy_url";

		it("Should set header for empty headers", () => {
			const options: FetchRequestInit = {
				method: "test",
			};
			appendRequestHeader(options, key, value);
			assert.isDefined(options.headers);
			assert.equal(options.headers[key], value);
		});

		it("Should set header in headers object if header is not present", () => {
			const options: FetchRequestInit = {
				method: "test",
				headers: {
					version: "version",
				},
			};
			appendRequestHeader(options, key, value);
			assert.equal(options.headers[key], value);
		});

		it("Should append header in headers object", () => {
			const options: FetchRequestInit = {
				method: "test",
				headers: {
					version: "version",
					[key]: firstValue,
				},
			};
			appendRequestHeader(options, key, value);
			assert.equal(options.headers[key], `${firstValue}, ${value}`);
		});

		it("Should append header in headers object even if the value is duplicate", () => {
			const options: FetchRequestInit = {
				method: "test",
				headers: {
					version: "version",
					[key]: value,
				},
			};
			appendRequestHeader(options, key, value);
			assert.equal(options.headers[key], `${value}, ${value}`);
		});

		it("Should append case-insensitively on record with custom separator without duplicating keys", () => {
			const options: FetchRequestInit = {
				method: "GET",
				headers: {
					"user-agent": "custom-app/1.0",
				},
			};
			appendRequestHeader(options, "User-Agent", "kiota/1.0", " ");
			assert.equal(options.headers?.["User-Agent"], "custom-app/1.0 kiota/1.0");
			assert.deepEqual(Object.keys(options.headers ?? {}), ["User-Agent"]);
		});

		it("Should append on Headers instance honoring custom separator", () => {
			const headers = new Headers({ "user-agent": "custom-app/1.0" });
			const options: RequestInit = { method: "GET", headers };
			appendRequestHeader(options, "User-Agent", "kiota/1.0", " ");
			assert.equal(headers.get("User-Agent"), "custom-app/1.0 kiota/1.0");
		});

		it("Should append case-insensitively on tuple array honoring custom separator", () => {
			const headers: [string, string][] = [
				["user-agent", "custom-app/1.0"],
				["Accept", "application/json"],
			];
			const options: RequestInit = { method: "GET", headers };
			appendRequestHeader(options, "User-Agent", "kiota/1.0", " ");
			assert.deepEqual(headers, [
				["User-Agent", "custom-app/1.0 kiota/1.0"],
				["Accept", "application/json"],
			]);
		});
	});
});
