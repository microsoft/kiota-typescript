import { DummyFetchHandler } from "./dummyFetchHandler";
import { CompressionHandlerOptions } from "../../../src/middlewares/options/compressionHandlerOptions";
import { CompressionHandler } from "../../../src/middlewares/compressionHandler";

const defaultOptions = new CompressionHandlerOptions();

import { assert, describe, it, expect, beforeEach, vi } from "vitest";
import { inNodeEnv } from "@microsoft/kiota-abstractions";

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
		const decompressedBody = inNodeEnv() ? await decompressUsingZlib(compressedBody) : await decompressUsingDecompressionStream(compressedBody);
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
});

// helper function to decompress ArrayBuffer using zlib
async function decompressUsingZlib(arrayBuffer: ArrayBuffer): Promise<string> {
	return new Promise(async (resolve, reject) => {
		// @ts-ignore
		const zlib = await import("zlib");
		// Convert the ArrayBuffer to a Node.js Buffer
		const buffer = Buffer.from(arrayBuffer);
		console.log(buffer);

		// Decompress the buffer
		zlib.gunzip(buffer, (err, decompressedBuffer) => {
			if (err) {
				console.error(err);
				return reject(err);
			}
			// Convert the decompressed Buffer to a string and resolve the promise
			console.log("decompressed " + decompressedBuffer.toString());
			resolve(decompressedBuffer.toString("utf-8"));
		});
	});
}

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
