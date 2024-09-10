import { DummyFetchHandler } from "./dummyFetchHandler";
import { CompressionHandlerOptions } from "../../../src/middlewares/options/compressionHandlerOptions";
import { CompressionHandler } from "../../../src/middlewares/compressionHandler";

const defaultOptions = new CompressionHandlerOptions();

import { assert, describe, it, expect, beforeEach, vi } from "vitest";

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

	it("should not compress if ShouldCompress is false", async () => {
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

	it("should compress the request body if ShouldCompress is true", async () => {
		const options = new CompressionHandlerOptions({ enableCompression: true });
		compressionHandler = new CompressionHandler(options);

		compressionHandler.next = nextMiddleware;
		nextMiddleware.setResponses([new Response("ok", { status: 200 })]);

		const requestInit = { headers: new Headers(), body: "test" };
		await compressionHandler.execute("http://example.com", requestInit);

		expect(requestInit.headers.get("Content-Encoding")).toBe("gzip");
	});

	it("should handle 415 response and retry without compression", async () => {
		const options = new CompressionHandlerOptions({ enableCompression: true });
		compressionHandler = new CompressionHandler(options);

		compressionHandler.next = nextMiddleware;
		nextMiddleware.setResponses([new Response("nope", { status: 415 }), new Response("ok", { status: 200 })]);

		const requestInit = { headers: new Headers(), body: "test" };
		const response = await compressionHandler.execute("http://example.com", requestInit);

		expect(requestInit.headers.has("Content-Encoding")).toBe(false);
		expect(response).toBeInstanceOf(Response);
	});
});
