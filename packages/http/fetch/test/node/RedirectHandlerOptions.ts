/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { RedirectHandlerOptions } from "../../src/middlewares/options/redirectHandlerOptions";

describe("RedirectHandlerOptions.ts", () => {
	describe("constructor", () => {
		it("Should initialize the instance with given options", () => {
			const shouldRedirect = (response: Response) => {
				if (response.status === 301) {
					return true;
				}
				return false;
			};
			const maxRedirects = 5;
			const options = new RedirectHandlerOptions({ maxRedirects, shouldRedirect });
			assert.equal(options.maxRedirects, maxRedirects);
			assert.equal(options.shouldRedirect, shouldRedirect);
		});

		it("Should throw error for setting max redirects more than allowed", () => {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const options = new RedirectHandlerOptions({ maxRedirects: 100 });
				throw new Error("Test Failed - Something wrong with the max redirects value redirection");
			} catch (error) {
				assert.equal((error as Error).name, "MaxLimitExceeded");
			}
		});
		it("Should throw error for setting max redirects to negative", () => {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const options = new RedirectHandlerOptions({ maxRedirects: -10 });
				throw new Error(" Test Failed - Something wrong with the max redirects value redirection");
			} catch (error) {
				assert.equal((error as Error).name, "MinExpectationNotMet");
			}
		});

		it("Should initialize instance with default options", () => {
			const options = new RedirectHandlerOptions();
			assert.equal(options.maxRedirects, RedirectHandlerOptions["DEFAULT_MAX_REDIRECTS"]);
			assert.equal(options.shouldRedirect, RedirectHandlerOptions["defaultShouldRetry"]);
			assert.equal(options.scrubSensitiveHeaders, RedirectHandlerOptions["defaultScrubSensitiveHeaders"]);
		});

		it("Should initialize instance with custom scrubSensitiveHeaders", () => {
			const customScrubber = (_headers: Record<string, string>, _originalUrl: string, _newUrl: string) => {
				// Custom logic
			};
			const options = new RedirectHandlerOptions({ scrubSensitiveHeaders: customScrubber });
			assert.equal(options.scrubSensitiveHeaders, customScrubber);
		});
	});

	describe("defaultScrubSensitiveHeaders", () => {
		it("Should remove Authorization and Cookie headers when host changes", () => {
			const headers = {
				Authorization: "Bearer token",
				Cookie: "session=SECRET",
				"Content-Type": "application/json",
			};
			RedirectHandlerOptions["defaultScrubSensitiveHeaders"](headers, "https://graph.microsoft.com/v1.0/me", "https://evil.attacker.com/steal");
			assert.isUndefined(headers.Authorization);
			assert.isUndefined(headers.Cookie);
			assert.isDefined(headers["Content-Type"]); // Other headers should remain
		});

		it("Should remove Authorization and Cookie headers when scheme changes", () => {
			const headers = {
				Authorization: "Bearer token",
				Cookie: "session=SECRET",
				"Content-Type": "application/json",
			};
			RedirectHandlerOptions["defaultScrubSensitiveHeaders"](headers, "https://graph.microsoft.com/v1.0/me", "http://graph.microsoft.com/v1.0/me");
			assert.isUndefined(headers.Authorization);
			assert.isUndefined(headers.Cookie);
			assert.isDefined(headers["Content-Type"]);
		});

		it("Should keep all headers when host and scheme are the same", () => {
			const headers = {
				Authorization: "Bearer token",
				Cookie: "session=SECRET",
				"Content-Type": "application/json",
			};
			RedirectHandlerOptions["defaultScrubSensitiveHeaders"](headers, "https://graph.microsoft.com/v1.0/me", "https://graph.microsoft.com/v2.0/me");
			assert.isDefined(headers.Authorization);
			assert.isDefined(headers.Cookie);
			assert.isDefined(headers["Content-Type"]);
		});

		it("Should handle invalid URLs gracefully", () => {
			const headers = {
				Authorization: "Bearer token",
				Cookie: "session=SECRET",
			};
			// Should not throw error for invalid URLs
			RedirectHandlerOptions["defaultScrubSensitiveHeaders"](headers, "not-a-valid-url", "also-invalid");
			// Headers should remain unchanged when URL parsing fails
			assert.isDefined(headers.Authorization);
			assert.isDefined(headers.Cookie);
		});

		it("Should handle null/undefined inputs gracefully", () => {
			// Should not throw error for null/undefined inputs
			RedirectHandlerOptions["defaultScrubSensitiveHeaders"](null as any, "https://example.com", "https://other.com");
			RedirectHandlerOptions["defaultScrubSensitiveHeaders"]({} as any, null as any, "https://other.com");
			RedirectHandlerOptions["defaultScrubSensitiveHeaders"]({} as any, "https://example.com", null as any);
		});
	});
});
