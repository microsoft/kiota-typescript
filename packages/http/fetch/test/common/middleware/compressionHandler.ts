/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { trace } from "@opentelemetry/api";
import { assert, beforeEach, describe, expect, it, vi } from "vitest";

import { CompressionHandler, CompressionHandlerOptions, ObservabilityOptionKey, ObservabilityOptionsImpl } from "../../../src";
import { DummyFetchHandler } from "./dummyFetchHandler";

const defaultOptions = new CompressionHandlerOptions();

describe("CompressionHandler", () => {
	let compressionHandler: CompressionHandler;
	let nextMiddleware: DummyFetchHandler;

	beforeEach(() => {
		nextMiddleware = new DummyFetchHandler();
		compressionHandler = new CompressionHandler();
		compressionHandler.next = nextMiddleware;
	});

	describe("constructor", () => {
		it("Should create an instance with given options", () => {
			const handler = new CompressionHandler(defaultOptions);
			assert.isDefined(handler["handlerOptions"]);
		});

		it("Should create an instance with default set of options", () => {
			const handler = new CompressionHandler();
			assert.isDefined(handler["handlerOptions"]);
		});
	});

	it("should throw an error if handlerOptions is undefined", () => {
		expect(() => new CompressionHandler(null as any)).toThrow("handlerOptions cannot be undefined");
	});

	it("should not compress if enableCompression is false", async () => {
		const options = new CompressionHandlerOptions({ enableCompression: false });
		compressionHandler = new CompressionHandler(options);

		compressionHandler.next = nextMiddleware;
		vi.spyOn(nextMiddleware, "execute");
		nextMiddleware.setResponses([new Response("ok", { status: 200 })]);

		const requestInit = { headers: new Headers(), body: "test" };
		const response = await compressionHandler.execute("http://example.com", requestInit);

		expect(requestInit.headers.has("Content-Encoding")).toBe(false);
		expect(nextMiddleware.execute).toHaveBeenCalled();
		expect(response).toBeInstanceOf(Response);
	});

	it("should compress the request body if enableCompression is true", async () => {
		const url = "https://example.com";
		const options = new CompressionHandlerOptions({ enableCompression: true });
		compressionHandler = new CompressionHandler(options);

		const requestBody = "test";
		compressionHandler.next = nextMiddleware;
		nextMiddleware.setResponses([new Response("ok", { status: 200 })]);

		const requestInit = { headers: {}, body: requestBody };
		await compressionHandler.execute(url, requestInit);

		expect((requestInit.headers as Record<string, string>)["Content-Encoding"]).toBe("gzip");
		const compressedBody = requestInit.body as unknown as ArrayBuffer;
		const decompressedBody = await decompressUsingDecompressionStream(compressedBody);
		expect(decompressedBody).toBe(requestBody);
	});

	it("should handle 415 response and retry without compression", async () => {
		const url = "https://example.com";
		const options = new CompressionHandlerOptions({ enableCompression: true });
		compressionHandler = new CompressionHandler(options);

		compressionHandler.next = nextMiddleware;
		nextMiddleware.setResponses([new Response("nope", { status: 415 }), new Response("ok", { status: 200 })]);

		const requestInit = { headers: [], body: "test" };
		const response = await compressionHandler.execute(url, requestInit);

		expect((requestInit.headers as Record<string, string>)["Content-Encoding"]).toBeUndefined();
		expect(response).toBeInstanceOf(Response);
	});

	it("should restore a URL-encoded body after compression is rejected", async () => {
		const body = new URLSearchParams({ query: "hello world" });
		const sent: { body: BodyInit | null | undefined; contentType: string | null; contentEncoding: string | null }[] = [];
		nextMiddleware.execute = async (_url, init) => {
			const headers = new Headers(init.headers);
			sent.push({ body: init.body, contentType: headers.get("Content-Type"), contentEncoding: headers.get("Content-Encoding") });
			return new Response(null, { status: sent.length === 1 ? 415 : 200 });
		};

		const response = await compressionHandler.execute("https://example.com", { method: "POST", body, headers: { "content-type": "application/x-www-form-urlencoded; charset=utf-8" } });
		expect(response.status).toBe(200);
		expect(sent).toHaveLength(2);
		expect(sent[0].contentType).toBe("application/x-www-form-urlencoded; charset=utf-8");
		expect(sent[0].contentEncoding).toBe("gzip");
		expect(sent[0].body).toBeInstanceOf(ArrayBuffer);
		expect(sent[1].body).toBe(body);
		expect(sent[1].contentType).toBe("application/x-www-form-urlencoded; charset=utf-8");
		expect(sent[1].contentEncoding).toBeNull();
	});

	it("original headers were maintained in request", async () => {
		const url = "https://example.com";
		const options = new CompressionHandlerOptions({ enableCompression: true });
		compressionHandler = new CompressionHandler(options);

		compressionHandler.next = nextMiddleware;
		nextMiddleware.setResponses([new Response("ok", { status: 200 })]);

		const requestInit = {
			headers: {
				test: "test",
			},
			body: "test",
		};
		const response = await compressionHandler.execute(url, requestInit);
		expect((requestInit.headers as Record<string, string>)["Content-Encoding"]).toBe("gzip");
		expect((nextMiddleware.requests[0].headers as Record<string, string>)["test"]).toBe("test");
		expect(response).toBeInstanceOf(Response);
	});

	it("should not compress when Content-Range bytes header is present", async () => {
		const headerVariants: HeadersInit[] = [{ "Content-Range": "bytes 0-3/10" }, { "content-range": "BYTES 0-3/10" }, new Headers({ "Content-Range": "bytes 0-3/10" }), [["content-range", "bytes 0-3/10"]]];

		for (const headers of headerVariants) {
			nextMiddleware = new DummyFetchHandler();
			compressionHandler.next = nextMiddleware;
			nextMiddleware.setResponses([new Response("ok", { status: 200 })]);

			const requestInit: RequestInit = { method: "PUT", headers, body: "test" };
			await compressionHandler.execute("https://example.com", requestInit);

			expect(requestInit.body).toBe("test");
			expect(new Headers(requestInit.headers).get("Content-Encoding")).toBeNull();
		}
	});

	it("should not compress when Content-Encoding header is already present", async () => {
		const headerVariants: HeadersInit[] = [{ "Content-Encoding": "br" }, { "content-encoding": "gzip" }, new Headers({ "Content-Encoding": "deflate" }), [["content-encoding", "br"]]];

		for (const headers of headerVariants) {
			nextMiddleware = new DummyFetchHandler();
			compressionHandler.next = nextMiddleware;
			nextMiddleware.setResponses([new Response("ok", { status: 200 })]);

			const requestInit: RequestInit = { method: "POST", headers, body: "already-encoded" };
			await compressionHandler.execute("https://example.com", requestInit);

			expect(requestInit.body).toBe("already-encoded");
		}
	});

	it("should compress an empty string body without deadlocking", async () => {
		nextMiddleware.setResponses([new Response("ok", { status: 200 })]);
		const requestInit: RequestInit = { method: "POST", headers: {}, body: "" };

		const response = await compressionHandler.execute("https://example.com", requestInit);

		expect(response.status).toBe(200);
		expect(new Headers(requestInit.headers).get("Content-Encoding")).toBe("gzip");
		expect(requestInit.body).toBeInstanceOf(ArrayBuffer);
		const decompressedBody = await decompressUsingDecompressionStream(requestInit.body as ArrayBuffer);
		expect(decompressedBody).toBe("");
	});

	it("should set and remove Content-Encoding on Headers instances during 415 retry", async () => {
		const headers = new Headers({ Accept: "application/json" });
		const observedEncodings: (string | null)[] = [];
		nextMiddleware.execute = async (_url, init) => {
			observedEncodings.push(new Headers(init.headers).get("Content-Encoding"));
			return new Response(null, { status: observedEncodings.length === 1 ? 415 : 200 });
		};

		const requestInit: RequestInit = { method: "POST", headers, body: "payload" };
		const response = await compressionHandler.execute("https://example.com", requestInit);

		expect(response.status).toBe(200);
		expect(requestInit.headers).toBe(headers);
		expect(observedEncodings).toEqual(["gzip", null]);
		expect(headers.get("Content-Encoding")).toBeNull();
		expect(headers.get("Accept")).toBe("application/json");
	});

	it("should preserve Headers instance and clean up synthesized Content-Type for URLSearchParams on 415 retry", async () => {
		const headers = new Headers({ "X-Custom": "keep-me" });
		const body = new URLSearchParams({ key: "value" });
		const observed: { contentType: string | null; contentEncoding: string | null; isUrlSearchParams: boolean }[] = [];
		nextMiddleware.execute = async (_url, init) => {
			const currentHeaders = new Headers(init.headers);
			observed.push({
				contentType: currentHeaders.get("Content-Type"),
				contentEncoding: currentHeaders.get("Content-Encoding"),
				isUrlSearchParams: init.body instanceof URLSearchParams,
			});
			return new Response(null, { status: observed.length === 1 ? 415 : 200 });
		};

		const requestInit: RequestInit = { method: "POST", headers, body };
		const response = await compressionHandler.execute("https://example.com", requestInit);

		expect(response.status).toBe(200);
		expect(requestInit.headers).toBe(headers);
		expect(headers.get("X-Custom")).toBe("keep-me");
		expect(observed).toEqual([
			{ contentType: "application/x-www-form-urlencoded;charset=UTF-8", contentEncoding: "gzip", isUrlSearchParams: false },
			{ contentType: null, contentEncoding: null, isUrlSearchParams: true },
		]);
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
			nextMiddleware.execute = async () => {
				await downstreamBlocked;
				assert.isFalse(spanEnded);
				throw new Error("compression downstream transport failure");
			};

			try {
				const execution = compressionHandler.execute("https://example.com", { method: "POST", body: "payload" }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				await vi.waitFor(() => assert.isDefined(releaseDownstream));
				assert.isFalse(spanEnded);
				releaseDownstream?.();
				await execution;
				assert.fail("should have thrown");
			} catch (err: any) {
				assert.equal(err.message, "compression downstream transport failure");
				assert.isTrue(spanEnded);
				assert.isDefined(recordedException);
			} finally {
				getTracerSpy.mockRestore();
			}
		});

		it("sets enabled attribute based on options", async () => {
			let enabledAttribute: unknown;
			const testSpan = {
				setAttribute: (name: string, value: unknown) => {
					if (name === "com.microsoft.kiota.handler.compression.enable") {
						enabledAttribute = value;
					}
				},
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
			const disabledHandler = new CompressionHandler(new CompressionHandlerOptions({ enableCompression: false }));
			disabledHandler.next = nextMiddleware;

			try {
				await disabledHandler.execute("https://example.com", { method: "POST", body: "payload" }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				assert.isFalse(enabledAttribute);
			} finally {
				getTracerSpy.mockRestore();
			}
		});

		it("records UTF-8 byte length for multi-byte string bodies on 415 fallback", async () => {
			let recordedBodySize: unknown;
			const testSpan = {
				setAttribute: (name: string, value: unknown) => {
					if (name === "http.request.body.size") {
						recordedBodySize = value;
					}
				},
				recordException: () => {},
				end: () => {},
			};
			const tracer = {
				startActiveSpan: (_name: string, callback: (span: typeof testSpan) => Promise<Response>) => {
					return callback(testSpan);
				},
			};
			const getTracerSpy = vi.spyOn(trace, "getTracer").mockReturnValue(tracer as any);
			nextMiddleware.setResponses([new Response("unsupported", { status: 415 }), new Response("ok", { status: 200 })]);
			const multiByteBody = "héllo 🌍";

			try {
				await compressionHandler.execute("https://example.com", { method: "POST", headers: {}, body: multiByteBody }, { [ObservabilityOptionKey]: new ObservabilityOptionsImpl() });
				assert.equal(recordedBodySize, new TextEncoder().encode(multiByteBody).byteLength);
				assert.notEqual(recordedBodySize, multiByteBody.length);
			} finally {
				getTracerSpy.mockRestore();
			}
		});
	});
});

// helper function to convert ArrayBuffer to string using DecompressionStream
async function decompressUsingDecompressionStream(compressedArrayBuffer: ArrayBuffer): Promise<string> {
	const decompressionStream = new DecompressionStream("gzip");

	const compressedStream = new ReadableStream<Uint8Array>({
		start(controller) {
			// Convert ArrayBuffer to Uint8Array
			const uint8Array = new Uint8Array(compressedArrayBuffer);

			// Enqueue the Uint8Array into the stream
			controller.enqueue(uint8Array);

			// Close the stream after pushing all the data
			controller.close();
		},
	});

	if (!compressedStream) {
		throw new Error("Unable to create readable stream from ArrayBuffer");
	}

	const decompressedStream = compressedStream.pipeThrough(decompressionStream);

	const reader = decompressedStream.getReader();
	const decompressedChunks: Uint8Array[] = [];
	let totalLength = 0;

	let result = await reader.read();
	while (!result.done) {
		const chunk = result.value;
		decompressedChunks.push(chunk);
		totalLength += chunk.length;
		result = await reader.read();
	}

	const decompressedArray = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of decompressedChunks) {
		decompressedArray.set(chunk, offset);
		offset += chunk.length;
	}

	const textDecoder = new TextDecoder();
	return textDecoder.decode(decompressedArray);
}
