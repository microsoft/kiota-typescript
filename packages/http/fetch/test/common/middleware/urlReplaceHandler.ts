/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { trace } from "@opentelemetry/api";
import { assert, describe, it, vi } from "vitest";

import { UrlReplaceHandlerOptions } from "../../../src/middlewares/options/urlReplaceHandlerOptions";
import { UrlReplaceHandler } from "../../../src/middlewares/urlReplaceHandler";
import { ObservabilityOptionKey, ObservabilityOptionsImpl } from "../../../src/observabilityOptions";
import { getResponse } from "../../testUtils";
import { DummyFetchHandler } from "./dummyFetchHandler";
// eslint-disable-next-line no-var
var Response = Response;
if (typeof Response !== "object") {
	Response = getResponse();
}

describe("UrlReplaceHandler.ts", function () {
	const dummyFetchHandler = new DummyFetchHandler();
	const urlReplaceHandler = new UrlReplaceHandler(
		new UrlReplaceHandlerOptions({
			enabled: true,
			urlReplacements: {
				"/users/meTokenToReplace": "/me",
			},
		}),
	);
	urlReplaceHandler.next = dummyFetchHandler;
	describe("replaceTokensInUrl", () => {
		it("Should replace the token in the url", () => {
			dummyFetchHandler.setResponses([
				new Response("", {
					status: 200,
					statusText: "OK",
				}),
			]);
			const requestUrl = "https://graph.microsoft.com/v1.0/users/meTokenToReplace/messages";
			const fetchRequestInit = {
				method: "GET",
			};
			urlReplaceHandler.execute(requestUrl, fetchRequestInit);
			assert.equal(dummyFetchHandler.urls[0], "https://graph.microsoft.com/v1.0/me/messages");
			dummyFetchHandler.urls = [];
		});
		it("Should not replace the token in the url", () => {
			dummyFetchHandler.setResponses([
				new Response("", {
					status: 200,
					statusText: "OK",
				}),
			]);
			const requestUrl = "https://graph.microsoft.com/v1.0/users/meOtherToReplace/messages";
			const fetchRequestInit = {
				method: "GET",
			};
			urlReplaceHandler.execute(requestUrl, fetchRequestInit);
			assert.equal(dummyFetchHandler.urls[0], "https://graph.microsoft.com/v1.0/users/meOtherToReplace/messages");
			dummyFetchHandler.urls = [];
		});
	});
	describe("observability", () => {
		it("encloses downstream execution and records exception on failure", async () => {
			let spanEnded = false;
			let recordedException: unknown;
			const testSpan = {
				setAttribute: () => {},
				recordException: (err: unknown) => {
					recordedException = err;
				},
				end: () => {
					spanEnded = true;
				},
			};
			const tracer = {
				startActiveSpan: (_name: string, callback: (span: typeof testSpan) => Promise<Response>) => {
					return callback(testSpan);
				},
			};
			const getTracerSpy = vi.spyOn(trace, "getTracer").mockReturnValue(tracer as any);
			let releaseDownstream: (() => void) | undefined;
			const downstreamBlocked = new Promise<void>((resolve) => {
				releaseDownstream = resolve;
			});
			const dummyFetch = new DummyFetchHandler();
			dummyFetch.execute = async () => {
				await downstreamBlocked;
				assert.isFalse(spanEnded);
				throw new Error("network reset");
			};
			const handler = new UrlReplaceHandler(new UrlReplaceHandlerOptions({ enabled: true, urlReplacements: { "/old": "/new" } }));
			handler.next = dummyFetch;

			try {
				const execution = handler.execute("https://example.com/old", { method: "GET" }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				await vi.waitFor(() => assert.isDefined(releaseDownstream));
				assert.isFalse(spanEnded);
				releaseDownstream?.();
				await execution;
				assert.fail("should have thrown");
			} catch (err: any) {
				assert.equal(err.message, "network reset");
				assert.isTrue(spanEnded);
				assert.isDefined(recordedException);
			} finally {
				getTracerSpy.mockRestore();
			}
		});
	});
});
