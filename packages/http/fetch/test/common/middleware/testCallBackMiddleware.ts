import { RequestOption } from "@microsoft/kiota-abstractions";

import { Middleware } from "../../../src/middlewares/middleware";
import { DummyFetchHandler } from "./dummyFetchHandler";

export class TestCallBackMiddleware implements Middleware {
	constructor(private callback: (url: string) => void, nextMiddleware: Middleware = new DummyFetchHandler()) {
		this.next = nextMiddleware;
	}
	next: Middleware;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		this.callback(url);
		return new Response("ok", { status: 200 });
	}
}
