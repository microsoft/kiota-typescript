import type { RequestOption } from "@microsoft/kiota-abstractions";

import type { Middleware } from "../../../src/middlewares/middleware";
import { getResponse } from "../../testUtils";
import { DummyFetchHandler } from "./dummyFetchHandler";

// eslint-disable-next-line no-var
var Response = Response;
if (typeof Response !== "object") {
	Response = getResponse();
}

export class TestCallBackMiddleware implements Middleware {
	constructor(
		private callback: (url: string) => void,
		nextMiddleware: Middleware = new DummyFetchHandler(),
	) {
		this.next = nextMiddleware;
	}
	next: Middleware;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(url: string, requestInit: RequestInit, requestOptions?: Record<string, RequestOption>): Promise<Response> {
		this.callback(url);
		return new Response("ok", { status: 200 });
	}
}
