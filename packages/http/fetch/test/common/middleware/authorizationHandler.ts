/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { AccessTokenProvider, AllowedHostsValidator, BaseBearerTokenAuthenticationProvider } from "@microsoft/kiota-abstractions";
import { trace } from "@opentelemetry/api";
import { assert, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthorizationHandler, CompressionHandler, ObservabilityOptionKey, ObservabilityOptionsImpl } from "../../../src";
import { DummyFetchHandler } from "./dummyFetchHandler";

describe("AuthorizationHandler", () => {
	let authorizationHandler: AuthorizationHandler;
	let nextMiddleware: DummyFetchHandler;
	let tokenProvider: AccessTokenProvider;

	beforeEach(() => {
		nextMiddleware = new DummyFetchHandler();
		const validator = new AllowedHostsValidator();
		tokenProvider = {
			getAuthorizationToken: async () => "New Token",
			getAllowedHostsValidator: () => validator,
		};
		const provider = new BaseBearerTokenAuthenticationProvider(tokenProvider);
		authorizationHandler = new AuthorizationHandler(provider);
		authorizationHandler.next = nextMiddleware;
	});

	it("should not add a header if authorization header exists", async () => {
		const url = "https://example.com";
		const requestInit = {
			headers: {
				Authorization: "Bearer Existing Token",
			},
		};
		nextMiddleware.setResponses([new Response("ok", { status: 200 })]);

		await authorizationHandler.execute(url, requestInit);

		expect((requestInit.headers as Record<string, string>)["Authorization"]).toBe("Bearer Existing Token");
	});

	it("should attempt to authenticate when the header does not exist", async () => {
		const url = "https://example.com";
		const requestInit = { headers: {} };
		nextMiddleware.setResponses([new Response("ok", { status: 200 })]);

		await authorizationHandler.execute(url, requestInit);

		expect((requestInit.headers as Record<string, string>)["Authorization"]).toBe("Bearer New Token");
	});

	it("replaces the bearer token on claims replay when the request body is compressed", async () => {
		const claims = "required-claims";
		tokenProvider.getAuthorizationToken = async (_url, context) => (context?.claims === claims ? "claims-token" : "initial-token");
		const compression = new CompressionHandler();
		authorizationHandler.next = compression;
		compression.next = nextMiddleware;
		const sent: { authorization: string | null; encoding: string | null }[] = [];
		nextMiddleware.execute = async (_url, init) => {
			const headers = new Headers(init.headers);
			sent.push({ authorization: headers.get("Authorization"), encoding: headers.get("Content-Encoding") });
			return sent.length === 1 ? new Response(null, { status: 401, headers: { "WWW-Authenticate": `Bearer claims="${claims}"` } }) : new Response(null, { status: 200 });
		};

		const response = await authorizationHandler.execute("https://example.com", { method: "POST", body: "payload" });
		expect(response.status).toBe(200);
		expect(sent).toEqual([
			{ authorization: "Bearer initial-token", encoding: "gzip" },
			{ authorization: "Bearer claims-token", encoding: "gzip" },
		]);
	});

	describe("observability", () => {
		it("encloses downstream execution and records exception on failure", async () => {
			let spanEnded = false;
			let recordedException: unknown;
			const testSpan = {
				setAttribute: () => {},
				addEvent: () => {},
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
			nextMiddleware.execute = async () => {
				await downstreamBlocked;
				assert.isFalse(spanEnded);
				throw new Error("downstream auth failure");
			};

			try {
				const execution = authorizationHandler.execute("https://example.com", { headers: {} }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				await vi.waitFor(() => assert.isDefined(releaseDownstream));
				assert.isFalse(spanEnded);
				releaseDownstream?.();
				await execution;
				assert.fail("should have thrown");
			} catch (err: any) {
				assert.equal(err.message, "downstream auth failure");
				assert.isTrue(spanEnded);
				assert.isDefined(recordedException);
			} finally {
				getTracerSpy.mockRestore();
			}
		});

		it("records exception when token acquisition fails", async () => {
			let spanEnded = false;
			let recordedException: unknown;
			const testSpan = {
				setAttribute: () => {},
				addEvent: () => {},
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
			tokenProvider.getAuthorizationToken = async () => {
				assert.isFalse(spanEnded);
				throw new Error("token fetch error");
			};

			try {
				await authorizationHandler.execute("https://example.com", { headers: {} }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				assert.fail("should have thrown");
			} catch (err: any) {
				assert.equal(err.message, "token fetch error");
				assert.isTrue(spanEnded);
				assert.isDefined(recordedException);
			} finally {
				getTracerSpy.mockRestore();
			}
		});

		it("sets token_present attribute when authorization header is already provided", async () => {
			let tokenPresentAttribute: unknown;
			const testSpan = {
				setAttribute: (name: string, value: unknown) => {
					if (name === "com.microsoft.kiota.handler.authorization.token_present") {
						tokenPresentAttribute = value;
					}
				},
				addEvent: () => {},
				recordException: () => {},
				end: () => {},
			};
			const tracer = {
				startActiveSpan: (_name: string, callback: (span: typeof testSpan) => Promise<Response>) => {
					return callback(testSpan);
				},
			};
			const getTracerSpy = vi.spyOn(trace, "getTracer").mockReturnValue(tracer as any);
			nextMiddleware.setResponses([new Response("ok", { status: 200 })]);

			try {
				await authorizationHandler.execute("https://example.com", { headers: { Authorization: "Bearer test-token" } }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				assert.isTrue(tokenPresentAttribute);
			} finally {
				getTracerSpy.mockRestore();
			}
		});
	});
});
