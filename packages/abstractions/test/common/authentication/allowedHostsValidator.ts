/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { expect, describe, beforeEach, it, vi } from "vitest";
import { AllowedHostsValidator, ApiKeyAuthenticationProvider, ApiKeyLocation } from "../../../src/authentication";
import { RequestInformation } from "../../../src/requestInformation";
import * as utils from "../../../src/utils";

describe("AllowedHostsValidator", () => {
	let validator: AllowedHostsValidator;

	beforeEach(() => {
		validator = new AllowedHostsValidator(new Set(["example.com", "test.com"]));
	});

	it("constructor should validate hosts", () => {
		expect(() => new AllowedHostsValidator(new Set(["http://invalid.com"]))).to.throw("host should not contain http or https prefix");
	});

	it("constructor should validate hosts with leading/trailing whitespace", () => {
		expect(() => new AllowedHostsValidator(new Set(["  http://invalid.com  "]))).to.throw("host should not contain http or https prefix");
		expect(() => new AllowedHostsValidator(new Set(["  https://invalid.com  "]))).to.throw("host should not contain http or https prefix");
	});

	it("constructor should reject nonempty allowlist that normalizes to empty", () => {
		expect(() => new AllowedHostsValidator(new Set(["   "]))).to.throw("hostsToValidate cannot normalize to an empty set from a non-empty allowlist");
		expect(() => new AllowedHostsValidator(new Set([""]))).to.throw("hostsToValidate cannot normalize to an empty set from a non-empty allowlist");
	});

	it("constructor should preserve unrestricted access for explicitly empty allowlist", () => {
		const emptyValidator = new AllowedHostsValidator(new Set());
		expect(emptyValidator.getAllowedHosts()).to.deep.equal([]);
	});

	it("getAllowedHosts should return correct hosts", () => {
		expect(JSON.stringify(validator.getAllowedHosts())).to.equal(JSON.stringify(["example.com", "test.com"]));
	});

	it("getAllowedHosts should trim hosts", () => {
		const trimmedValidator = new AllowedHostsValidator(new Set(["  example.com  ", "  test.com "]));
		expect(JSON.stringify(trimmedValidator.getAllowedHosts())).to.equal(JSON.stringify(["example.com", "test.com"]));
	});

	it("setAllowedHosts should update allowed hosts", () => {
		validator.setAllowedHosts(new Set(["newhost.com"]));
		expect(JSON.stringify(validator.getAllowedHosts())).to.equal(JSON.stringify(["newhost.com"]));
	});

	it("setAllowedHosts should validate new hosts", () => {
		expect(() => validator.setAllowedHosts(new Set(["https://invalid.com"]))).to.throw("host should not contain http or https prefix");
		expect(() => validator.setAllowedHosts(new Set(["  https://invalid.com  "]))).to.throw("host should not contain http or https prefix");
	});

	it("setAllowedHosts should reject nonempty allowlist that normalizes to empty", () => {
		expect(() => validator.setAllowedHosts(new Set(["   "]))).to.throw("hostsToValidate cannot normalize to an empty set from a non-empty allowlist");
		expect(() => validator.setAllowedHosts(new Set([""]))).to.throw("hostsToValidate cannot normalize to an empty set from a non-empty allowlist");
	});

	it("setAllowedHosts should preserve unrestricted access for explicitly empty allowlist", () => {
		validator.setAllowedHosts(new Set());
		expect(validator.getAllowedHosts()).to.deep.equal([]);
	});

	it("isUrlHostValid should return true for valid hosts", () => {
		expect(validator.isUrlHostValid("http://example.com/path")).to.be.true;
		expect(validator.isUrlHostValid("http://test.com/path")).to.be.true;
	});

	it("isUrlHostValid should handle url with whitespace", () => {
		expect(validator.isUrlHostValid("  http://example.com/path  ")).to.be.true;
	});

	it("isUrlHostValid should return false for invalid hosts", () => {
		expect(validator.isUrlHostValid("http://invalid.com/path")).to.be.false;
	});

	it("isUrlHostValid should validate protocol-relative urls without an explicit scheme", () => {
		if (utils.inNodeEnv()) {
			expect(validator.isUrlHostValid("example.com/path")).to.be.true;
		}
		expect(validator.isUrlHostValid("//example.com/path")).to.be.true;
		expect(validator.isUrlHostValid("//invalid.com/path")).to.be.false;
	});

	it("isUrlHostValid should return true for subdomain matching allowed suffix", () => {
		validator = new AllowedHostsValidator(new Set([".fabric.microsoft.com"]));
		expect(validator.isUrlHostValid("https://abc.123.graphql.fabric.microsoft.com/path")).to.be.true;
	});

	it("isUrlHostValid should return false for bare domain when allowed as suffix", () => {
		validator = new AllowedHostsValidator(new Set([".fabric.microsoft.com"]));
		expect(validator.isUrlHostValid("https://fabric.microsoft.com/path")).to.be.false;
	});

	it("isUrlHostValid suffix matching should be case insensitive", () => {
		validator = new AllowedHostsValidator(new Set([".Fabric.Microsoft.COM"]));
		expect(validator.isUrlHostValid("https://ABC.z2c.graphql.fabric.microsoft.com/path")).to.be.true;
	});

	it("isUrlHostValid should allow multiple valid hosts with suffix entries", () => {
		validator = new AllowedHostsValidator(new Set(["example.com", "api.example.com", ".fabric.microsoft.com"]));
		expect(validator.isUrlHostValid("https://example.com/path")).to.be.true;
		expect(validator.isUrlHostValid("https://api.example.com/path")).to.be.true;
		expect(validator.isUrlHostValid("https://other.com/path")).to.be.false;
		expect(validator.isUrlHostValid("https://abc.123.graphql.fabric.microsoft.com/path")).to.be.true;
	});

	it("isUrlHostValid should allow suffix based hosts after update", () => {
		validator.setAllowedHosts(new Set([".fabric.microsoft.com"]));
		expect(validator.isUrlHostValid("https://abc.123.graphql.fabric.microsoft.com/path")).to.be.true;
	});

	it("isUrlHostValid should return false for invalid URLs", () => {
		expect(validator.isUrlHostValid("invalid")).to.be.false;
	});

	it("isUrlHostValid should return false for a mismatched host in the userinfo section", () => {
		expect(validator.isUrlHostValid("https://example.com:443@evil.com/path")).to.be.false;
	});

	it("isUrlHostValid should return false when userinfo is present", () => {
		expect(validator.isUrlHostValid("https://user:pass@example.com/path")).to.be.false;
	});

	it("isUrlHostValid should reject userinfo even when allowedHosts is empty", () => {
		const emptyValidator = new AllowedHostsValidator();
		expect(emptyValidator.isUrlHostValid("https://user:pass@example.com/path")).to.be.false;
		expect(emptyValidator.isUrlHostValid("https://example.com/path")).to.be.true;
	});

	it("isUrlHostValid should return false in browser for unparsed URLs when allowlist is empty", () => {
		const emptyValidator = new AllowedHostsValidator();
		if (typeof window === "undefined") {
			try {
				(globalThis as any).window = {
					location: {
						protocol: "https:",
						host: "example.com",
					},
				};
				expect(emptyValidator.isUrlHostValid("http%")).to.be.false;
				expect(emptyValidator.isUrlHostValid("https:user:pass@example.com/path")).to.be.false;
			} finally {
				delete (globalThis as any).window;
			}
		} else {
			expect(emptyValidator.isUrlHostValid("http%")).to.be.false;
			expect(emptyValidator.isUrlHostValid("https:user:pass@example.com/path")).to.be.false;
		}
	});

	it("isUrlHostValid should handle scheme-less hosts beginning with http", () => {
		const emptyValidator = new AllowedHostsValidator();
		expect(emptyValidator.isUrlHostValid("httpbin.org/path")).to.be.true;
		expect(emptyValidator.isUrlHostValid("httpbin.org")).to.be.true;
		expect(emptyValidator.isUrlHostValid("//httpbin.org/path")).to.be.true;
		expect(emptyValidator.isUrlHostValid("https-service.internal/path")).to.be.true;

		const httpbinValidator = new AllowedHostsValidator(new Set(["httpbin.org"]));
		if (utils.inNodeEnv()) {
			expect(httpbinValidator.isUrlHostValid("httpbin.org/path")).to.be.true;
		} else {
			// In browser environments where origin != httpbin.org, bare scheme-less host resolves to browser origin
			expect(httpbinValidator.isUrlHostValid("httpbin.org/path")).to.be.false;
		}
		expect(httpbinValidator.isUrlHostValid("http://httpbin.org/path")).to.be.true;
		expect(httpbinValidator.isUrlHostValid("https://httpbin.org/path")).to.be.true;
		expect(httpbinValidator.isUrlHostValid("//httpbin.org/path")).to.be.true;
		expect(httpbinValidator.isUrlHostValid("example.com/path")).to.be.false;
	});

	it("isUrlHostValid should resolve browser-relative URLs against browser location", () => {
		const emptyValidator = new AllowedHostsValidator();
		const relativeUrls = ["/", "/?q=1", "?q=1", "/api/v1/users", "./path/to/resource"];

		if (typeof window === "undefined") {
			try {
				(globalThis as any).window = {
					location: {
						protocol: "https:",
						host: "example.com",
					},
				};
				for (const relUrl of relativeUrls) {
					expect(emptyValidator.isUrlHostValid(relUrl)).to.be.true;
					expect(validator.isUrlHostValid(relUrl)).to.be.true;
				}
				const otherValidator = new AllowedHostsValidator(new Set(["other.com"]));
				for (const relUrl of relativeUrls) {
					expect(otherValidator.isUrlHostValid(relUrl)).to.be.false;
				}
				expect(emptyValidator.isUrlHostValid("httpbin.org/path")).to.be.true;
				expect(emptyValidator.isUrlHostValid("//httpbin.org/path")).to.be.true;
				// In a browser with host example.com, bare scheme-less paths resolve against example.com.
				// Therefore otherValidator (allowlist other.com) rejects them, while validator (allowlist example.com) accepts.
				expect(otherValidator.isUrlHostValid("other.com/path")).to.be.false;
				expect(otherValidator.isUrlHostValid("example.com/path")).to.be.false;
				expect(validator.isUrlHostValid("other.com/path")).to.be.true;
				expect(validator.isUrlHostValid("example.com/path")).to.be.true;
				// Explicit absolute and protocol-relative URLs retain their specified destination host.
				expect(otherValidator.isUrlHostValid("https://other.com/path")).to.be.true;
				expect(otherValidator.isUrlHostValid("//other.com/path")).to.be.true;
			} finally {
				delete (globalThis as any).window;
			}
		} else {
			const currentHost = window.location.hostname;
			const matchingValidator = new AllowedHostsValidator(new Set([currentHost]));
			const nonMatchingValidator = new AllowedHostsValidator(new Set(["non-matching-domain.internal"]));

			for (const relUrl of relativeUrls) {
				expect(emptyValidator.isUrlHostValid(relUrl)).to.be.true;
				expect(matchingValidator.isUrlHostValid(relUrl)).to.be.true;
				expect(nonMatchingValidator.isUrlHostValid(relUrl)).to.be.false;
			}
			expect(emptyValidator.isUrlHostValid("httpbin.org/path")).to.be.true;
			expect(emptyValidator.isUrlHostValid("//httpbin.org/path")).to.be.true;
		}
	});

	it("isUrlHostValid should reject HTTP(S) URLs without // to prevent credential leakage", () => {
		const allowedValidator = new AllowedHostsValidator(new Set(["allowed.example"]));

		expect(allowedValidator.isUrlHostValid("https:allowed.example/api")).to.be.false;
		expect(allowedValidator.isUrlHostValid("https:/allowed.example/api")).to.be.false;
		expect(allowedValidator.isUrlHostValid("http:allowed.example/api")).to.be.false;
		expect(allowedValidator.isUrlHostValid("http:/allowed.example/api")).to.be.false;
		expect(allowedValidator.isUrlHostValid("https://allowed.example/api")).to.be.true;

		const emptyValidator = new AllowedHostsValidator();
		expect(emptyValidator.isUrlHostValid("https:allowed.example/api")).to.be.false;
		expect(emptyValidator.isUrlHostValid("https:/allowed.example/api")).to.be.false;
		expect(emptyValidator.isUrlHostValid("http:allowed.example/api")).to.be.false;
		expect(emptyValidator.isUrlHostValid("http:/allowed.example/api")).to.be.false;

		if (typeof window === "undefined") {
			try {
				(globalThis as any).window = {
					location: {
						protocol: "https:",
						host: "other.example",
						hostname: "other.example",
						href: "https://other.example/page",
					},
				};
				expect(allowedValidator.isUrlHostValid("https:allowed.example/api")).to.be.false;
				expect(allowedValidator.isUrlHostValid("https:/allowed.example/api")).to.be.false;
				expect(allowedValidator.isUrlHostValid("http:allowed.example/api")).to.be.false;
				expect(allowedValidator.isUrlHostValid("http:/allowed.example/api")).to.be.false;
				expect(allowedValidator.isUrlHostValid("https://allowed.example/api")).to.be.true;
			} finally {
				delete (globalThis as any).window;
			}
		} else {
			expect(allowedValidator.isUrlHostValid("https:allowed.example/api")).to.be.false;
			expect(allowedValidator.isUrlHostValid("https:/allowed.example/api")).to.be.false;
			expect(allowedValidator.isUrlHostValid("http:allowed.example/api")).to.be.false;
			expect(allowedValidator.isUrlHostValid("http:/allowed.example/api")).to.be.false;
			expect(allowedValidator.isUrlHostValid("https://allowed.example/api")).to.be.true;
		}
	});

	it("isUrlHostValid should preserve Unicode whitespace and reject leading non-breaking space", () => {
		const allowedValidator = new AllowedHostsValidator(new Set(["allowed.example"]));
		expect(allowedValidator.isUrlHostValid("\u00a0https://allowed.example/api")).to.be.false;
		expect(allowedValidator.isUrlHostValid("https://allowed.example/api")).to.be.true;
		expect(allowedValidator.isUrlHostValid("  https://allowed.example/api  ")).to.be.true;

		const emptyValidator = new AllowedHostsValidator();
		expect(emptyValidator.isUrlHostValid("\u00a0https://allowed.example/api")).to.be.false;
	});

	it("isUrlHostValid should reject embedded URL whitespace that browsers remove", () => {
		const validator = new AllowedHostsValidator(new Set(["https"]));
		expect(validator.isUrlHostValid("ht\ttps://evil.example/api")).to.be.false;
		expect(validator.isUrlHostValid("ht\ntps://evil.example/api")).to.be.false;
		expect(validator.isUrlHostValid("ht\r\ntps://evil.example/api")).to.be.false;
	});

	it("isUrlHostValid should resolve relative URLs against document.baseURI when available", () => {
		const allowedValidator = new AllowedHostsValidator(new Set(["allowed.example"]));
		const otherValidator = new AllowedHostsValidator(new Set(["other.example"]));

		if (typeof document === "undefined") {
			const originalWindow = (globalThis as any).window;
			try {
				(globalThis as any).document = { baseURI: "https://other.example/" };
				(globalThis as any).window = { location: { protocol: "https:", host: "allowed.example", hostname: "allowed.example", href: "https://allowed.example/page" } };
				expect(allowedValidator.isUrlHostValid("/api")).to.be.false;
				expect(otherValidator.isUrlHostValid("/api")).to.be.true;
			} finally {
				delete (globalThis as any).document;
				if (originalWindow === undefined) delete (globalThis as any).window;
				else (globalThis as any).window = originalWindow;
			}
			return;
		}

		// In browsers document is read-only; insert a temporary <base> to control baseURI.
		const baseElement = document.createElement("base");
		baseElement.href = "https://other.example/";
		document.head.prepend(baseElement);
		try {
			expect(allowedValidator.isUrlHostValid("/api")).to.be.false;
			expect(otherValidator.isUrlHostValid("/api")).to.be.true;
		} finally {
			baseElement.remove();
		}
	});

	describe("Browser URL resolution and credential leakage prevention (P1)", () => {
		const browserOrigin = "https://other.example/app/";

		const withBrowserBaseUrl = <T>(baseHref: string, fn: () => T | Promise<T>): T | Promise<T> => {
			if (typeof document !== "undefined") {
				const baseElement = document.createElement("base");
				baseElement.href = baseHref;
				document.head.prepend(baseElement);
				const cleanup = () => baseElement.remove();
				try {
					const result = fn();
					if (result && typeof (result as any).then === "function") {
						return (result as Promise<T>).finally(cleanup);
					}
					cleanup();
					return result;
				} catch (e) {
					cleanup();
					throw e;
				}
			} else {
				const originalDocument = (globalThis as any).document;
				const originalWindow = (globalThis as any).window;
				const parsed = new URL(baseHref);
				(globalThis as any).document = { baseURI: baseHref };
				(globalThis as any).window = {
					location: {
						href: baseHref,
						protocol: parsed.protocol,
						host: parsed.host,
						hostname: parsed.hostname,
					},
				};
				const cleanup = () => {
					if (originalDocument === undefined) delete (globalThis as any).document;
					else (globalThis as any).document = originalDocument;
					if (originalWindow === undefined) delete (globalThis as any).window;
					else (globalThis as any).window = originalWindow;
				};
				try {
					const result = fn();
					if (result && typeof (result as any).then === "function") {
						return (result as Promise<T>).finally(cleanup);
					}
					cleanup();
					return result;
				} catch (e) {
					cleanup();
					throw e;
				}
			}
		};

		it("Test A: different browser origin rejects bare scheme-less host targeting other origin", () => {
			withBrowserBaseUrl(browserOrigin, () => {
				const httpbinValidator = new AllowedHostsValidator(new Set(["httpbin.org"]));
				// On https://other.example/app/, 'httpbin.org/path' resolves to https://other.example/app/httpbin.org/path
				// The destination is other.example, NOT httpbin.org, so httpbinValidator must return false.
				expect(httpbinValidator.isUrlHostValid("httpbin.org/path")).to.be.false;

				// Conversely, an allowlist matching other.example accepts the resolved destination.
				const otherValidator = new AllowedHostsValidator(new Set(["other.example"]));
				expect(otherValidator.isUrlHostValid("httpbin.org/path")).to.be.true;
			});
		});

		it("Test B: explicit absolute URL is approved regardless of browser base URL", () => {
			withBrowserBaseUrl(browserOrigin, () => {
				const httpbinValidator = new AllowedHostsValidator(new Set(["httpbin.org"]));
				expect(httpbinValidator.isUrlHostValid("https://httpbin.org/path")).to.be.true;
			});
		});

		it("Test C: protocol-relative URL resolves with browser base protocol and target host", () => {
			withBrowserBaseUrl(browserOrigin, () => {
				const httpbinValidator = new AllowedHostsValidator(new Set(["httpbin.org"]));
				const otherValidator = new AllowedHostsValidator(new Set(["other.example"]));

				// //httpbin.org/path replaces authority with httpbin.org, using https: from browser base
				expect(httpbinValidator.isUrlHostValid("//httpbin.org/path")).to.be.true;
				expect(otherValidator.isUrlHostValid("//httpbin.org/path")).to.be.false;
			});
		});

		it("Test D: root-relative URL resolves against browser base origin", () => {
			withBrowserBaseUrl(browserOrigin, () => {
				const otherValidator = new AllowedHostsValidator(new Set(["other.example"]));
				const httpbinValidator = new AllowedHostsValidator(new Set(["httpbin.org"]));

				expect(otherValidator.isUrlHostValid("/api")).to.be.true;
				expect(httpbinValidator.isUrlHostValid("/api")).to.be.false;
			});
		});

		it("Test E: path-relative URL resolves against browser base URL", () => {
			withBrowserBaseUrl(browserOrigin, () => {
				const otherValidator = new AllowedHostsValidator(new Set(["other.example"]));
				const httpbinValidator = new AllowedHostsValidator(new Set(["httpbin.org"]));

				expect(otherValidator.isUrlHostValid("api/users")).to.be.true;
				expect(otherValidator.isUrlHostValid("./api")).to.be.true;
				expect(otherValidator.isUrlHostValid("../api")).to.be.true;
				expect(otherValidator.isUrlHostValid("?q=1")).to.be.true;
				expect(otherValidator.isUrlHostValid("#section")).to.be.true;

				expect(httpbinValidator.isUrlHostValid("api/users")).to.be.false;
				expect(httpbinValidator.isUrlHostValid("./api")).to.be.false;
				expect(httpbinValidator.isUrlHostValid("../api")).to.be.false;
			});
		});

		it.runIf(utils.inNodeEnv())("Test F: existing non-browser bare-host behavior is preserved in Node.js", () => {
			const httpbinValidator = new AllowedHostsValidator(new Set(["httpbin.org"]));
			const exampleValidator = new AllowedHostsValidator(new Set(["example.com"]));

			expect(httpbinValidator.isUrlHostValid("httpbin.org/path")).to.be.true;
			expect(httpbinValidator.isUrlHostValid("example.com/path")).to.be.false;
			expect(httpbinValidator.isUrlHostValid("//httpbin.org/path")).to.be.true;
			expect(httpbinValidator.isUrlHostValid("https://httpbin.org/path")).to.be.true;

			expect(exampleValidator.isUrlHostValid("example.com/path")).to.be.true;
			expect(exampleValidator.isUrlHostValid("httpbin.org/path")).to.be.false;

			// In Node without a base URL, relative paths cannot be resolved
			expect(httpbinValidator.isUrlHostValid("/api")).to.be.false;
			expect(httpbinValidator.isUrlHostValid("./api")).to.be.false;
			expect(httpbinValidator.isUrlHostValid("?q=1")).to.be.false;
		});

		it("Test G: credential safety rejects malformed schemes, userinfo, and control characters", () => {
			const allowedValidator = new AllowedHostsValidator(new Set(["allowed.example", "example.com"]));
			const emptyValidator = new AllowedHostsValidator();

			expect(allowedValidator.isUrlHostValid("https:user:pass@example.com/path")).to.be.false;
			expect(allowedValidator.isUrlHostValid("https:allowed.example/api")).to.be.false;
			expect(allowedValidator.isUrlHostValid("https:/allowed.example/api")).to.be.false;
			expect(allowedValidator.isUrlHostValid("http:allowed.example/api")).to.be.false;
			expect(allowedValidator.isUrlHostValid("http:/allowed.example/api")).to.be.false;
			expect(allowedValidator.isUrlHostValid("https://user:pass@allowed.example/api")).to.be.false;
			expect(allowedValidator.isUrlHostValid("https://example.com:443@evil.com/path")).to.be.false;
			expect(allowedValidator.isUrlHostValid("http%")).to.be.false;
			expect(allowedValidator.isUrlHostValid("ht\ttps://allowed.example/api")).to.be.false;
			expect(allowedValidator.isUrlHostValid("\u00a0https://allowed.example/api")).to.be.false;

			expect(emptyValidator.isUrlHostValid("https:user:pass@example.com/path")).to.be.false;
			expect(emptyValidator.isUrlHostValid("https:allowed.example/api")).to.be.false;
			expect(emptyValidator.isUrlHostValid("https:/allowed.example/api")).to.be.false;
			expect(emptyValidator.isUrlHostValid("http%")).to.be.false;

			// Regression tests for Copilot review finding:
			// Literal percent signs in paths and queries are valid and should NOT be rejected
			expect(allowedValidator.isUrlHostValid("https://allowed.example/items/100%?q=50%")).to.be.true;
			expect(emptyValidator.isUrlHostValid("https://example.com/items/100%?q=50%")).to.be.true;
			expect(allowedValidator.isUrlHostValid("https://other.example/items/100%?q=50%")).to.be.false;

			// Valid percent-encoded components in paths and query strings (%20, %2F, %25, %3F, %23)
			expect(allowedValidator.isUrlHostValid("https://allowed.example/path/with%20space/and%2Fslash/and%25percent/and%3Fquestion/and%23hash?query=val%201&slash=a%2Fb&pct=100%25&q=a%3Fb&h=a%23b")).to.be.true;
			expect(allowedValidator.isUrlHostValid("https://allowed.example/items/100%20test")).to.be.true;
			expect(allowedValidator.isUrlHostValid("https://allowed.example/items/100%2Ftest")).to.be.true;
			expect(allowedValidator.isUrlHostValid("https://allowed.example/items/100%25test")).to.be.true;
			expect(allowedValidator.isUrlHostValid("https://allowed.example/items/100%3Ftest")).to.be.true;
			expect(allowedValidator.isUrlHostValid("https://allowed.example/items/100%23test")).to.be.true;
			expect(allowedValidator.isUrlHostValid("https://allowed.example/path?space=val%201&slash=a%2Fb&pct=100%25&q=a%3Fb&h=a%23b")).to.be.true;
		});

		it("Test H: actual fetch destination consistency between authentication and request execution", async () => {
			await withBrowserBaseUrl(browserOrigin, async () => {
				// 1. Provider with allowlist containing ONLY httpbin.org
				const httpbinProvider = new ApiKeyAuthenticationProvider("secret-api-key", "X-API-KEY", ApiKeyLocation.Header, new Set(["httpbin.org"]));
				const req1 = new RequestInformation();
				req1.URL = "httpbin.org/path";

				await httpbinProvider.authenticateRequest(req1);

				// Prove: credentials were NOT attached because the browser fetch destination would be other.example
				expect(req1.headers.tryGetValue("X-API-KEY")).to.be.null;

				// Verify actual destination browser fetch resolves to:
				const actualDestination1 = new URL(req1.URL, browserOrigin);
				expect(actualDestination1.hostname).to.equal("other.example");
				expect(actualDestination1.href).to.equal("https://other.example/app/httpbin.org/path");

				// 2. Provider with allowlist containing other.example (the actual destination)
				const otherValidator = new AllowedHostsValidator(new Set(["other.example"]));
				const httpbinValidator = new AllowedHostsValidator(new Set(["httpbin.org"]));

				// On https://other.example/app/, the bare-host input resolves to other.example
				expect(httpbinValidator.isUrlHostValid("httpbin.org/path")).to.be.false;
				expect(otherValidator.isUrlHostValid("httpbin.org/path")).to.be.true;

				// Verify actual destination matches the validated host
				const actualDestination2 = new URL("httpbin.org/path", browserOrigin);
				expect(actualDestination2.hostname).to.equal("other.example");
				expect(otherValidator.isUrlHostValid(actualDestination2.href)).to.be.true;
				expect(httpbinValidator.isUrlHostValid(actualDestination2.href)).to.be.false;

				// 3. Explicit absolute URL to httpbin.org
				const req3 = new RequestInformation();
				req3.URL = "https://httpbin.org/path";

				await httpbinProvider.authenticateRequest(req3);

				// Prove: credentials WERE attached because explicit absolute URL goes to httpbin.org
				expect(req3.headers.tryGetValue("X-API-KEY")).to.deep.equal(["secret-api-key"]);
				const actualDestination3 = new URL(req3.URL, browserOrigin);
				expect(actualDestination3.hostname).to.equal("httpbin.org");
				expect(httpbinValidator.isUrlHostValid(actualDestination3.href)).to.be.true;

				// 4. Same-origin browser-relative request with percent-encoded components (%20, %2F, %25, %3F, %23)
				expect(otherValidator.isUrlHostValid("api/items/100%25/sub%20item?q=val%201&slash=a%2Fb&pct=50%25&qmark=%3F&hash=%23")).to.be.true;
				expect(httpbinValidator.isUrlHostValid("api/items/100%25/sub%20item?q=val%201&slash=a%2Fb&pct=50%25&qmark=%3F&hash=%23")).to.be.false;

				const otherProvider = new ApiKeyAuthenticationProvider("other-api-key", "X-OTHER-KEY", ApiKeyLocation.Header, new Set(["other.example"]));
				if (!utils.inNodeEnv()) {
					const reqRelative = new RequestInformation();
					reqRelative.URL = "api/items/100%25/sub%20item?q=val%201&slash=a%2Fb&pct=50%25&qmark=%3F&hash=%23";
					if (typeof window !== "undefined" && window.location?.protocol?.toLowerCase() === "https:") {
						await otherProvider.authenticateRequest(reqRelative);
						expect(reqRelative.headers.tryGetValue("X-OTHER-KEY")).to.deep.equal(["other-api-key"]);
					} else {
						await expect(otherProvider.authenticateRequest(reqRelative)).rejects.toThrow("Authentication scheme can only be used with https requests");
						expect(reqRelative.headers.tryGetValue("X-OTHER-KEY")).to.be.null;
					}
					const actualRelDestination = new URL(reqRelative.URL, browserOrigin);
					expect(actualRelDestination.hostname).to.equal("other.example");
				}

				const req4 = new RequestInformation();
				req4.URL = "https://other.example/app/api/items/100%25/sub%20item?q=val%201&slash=a%2Fb&pct=50%25&qmark=%3F&hash=%23";

				await otherProvider.authenticateRequest(req4);

				// Prove: credentials WERE attached because the resolved host other.example is in the allowlist
				expect(req4.headers.tryGetValue("X-OTHER-KEY")).to.deep.equal(["other-api-key"]);
				const actualDestination4 = new URL(req4.URL, browserOrigin);
				expect(actualDestination4.hostname).to.equal("other.example");
				expect(actualDestination4.href).to.equal("https://other.example/app/api/items/100%25/sub%20item?q=val%201&slash=a%2Fb&pct=50%25&qmark=%3F&hash=%23");
				expect(otherValidator.isUrlHostValid(actualDestination4.href)).to.be.true;

				// 5. Same percent-encoded request with httpbinProvider (unallowlisted resolved host)
				const req5 = new RequestInformation();
				req5.URL = "api/items/100%25/sub%20item?q=val%201&slash=a%2Fb&pct=50%25&qmark=%3F&hash=%23";
				await httpbinProvider.authenticateRequest(req5);
				// Prove: credentials NOT attached to unallowlisted host even with encoded components
				expect(req5.headers.tryGetValue("X-API-KEY")).to.be.null;

				// 6. Explicit allowlisted absolute URL with percent-encoded components receives credentials
				const req6 = new RequestInformation();
				req6.URL = "https://httpbin.org/items/100%25/sub%20item?q=val%201&pct=50%25";
				await httpbinProvider.authenticateRequest(req6);
				expect(req6.headers.tryGetValue("X-API-KEY")).to.deep.equal(["secret-api-key"]);
				const actualDestination6 = new URL(req6.URL, browserOrigin);
				expect(actualDestination6.hostname).to.equal("httpbin.org");
				expect(httpbinValidator.isUrlHostValid(actualDestination6.href)).to.be.true;
			});
		});
	});
});
