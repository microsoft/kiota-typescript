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
		expect(validator.isUrlHostValid("example.com/path")).to.be.true;
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
		expect(httpbinValidator.isUrlHostValid("httpbin.org/path")).to.be.true;
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

		it("Test A: different browser origin rejects bare scheme-less host targeting other origin", () => {
			const originalDocument = (globalThis as any).document;
			const originalWindow = (globalThis as any).window;
			try {
				(globalThis as any).document = { baseURI: browserOrigin };
				(globalThis as any).window = { location: { href: browserOrigin, protocol: "https:", host: "other.example", hostname: "other.example" } };

				const httpbinValidator = new AllowedHostsValidator(new Set(["httpbin.org"]));
				// On https://other.example/app/, 'httpbin.org/path' resolves to https://other.example/app/httpbin.org/path
				// The destination is other.example, NOT httpbin.org, so httpbinValidator must return false.
				expect(httpbinValidator.isUrlHostValid("httpbin.org/path")).to.be.false;

				// Conversely, an allowlist matching other.example accepts the resolved destination.
				const otherValidator = new AllowedHostsValidator(new Set(["other.example"]));
				expect(otherValidator.isUrlHostValid("httpbin.org/path")).to.be.true;
			} finally {
				if (originalDocument === undefined) delete (globalThis as any).document;
				else (globalThis as any).document = originalDocument;
				if (originalWindow === undefined) delete (globalThis as any).window;
				else (globalThis as any).window = originalWindow;
			}
		});

		it("Test B: explicit absolute URL is approved regardless of browser base URL", () => {
			const originalDocument = (globalThis as any).document;
			const originalWindow = (globalThis as any).window;
			try {
				(globalThis as any).document = { baseURI: browserOrigin };
				(globalThis as any).window = { location: { href: browserOrigin, protocol: "https:", host: "other.example", hostname: "other.example" } };

				const httpbinValidator = new AllowedHostsValidator(new Set(["httpbin.org"]));
				expect(httpbinValidator.isUrlHostValid("https://httpbin.org/path")).to.be.true;
			} finally {
				if (originalDocument === undefined) delete (globalThis as any).document;
				else (globalThis as any).document = originalDocument;
				if (originalWindow === undefined) delete (globalThis as any).window;
				else (globalThis as any).window = originalWindow;
			}
		});

		it("Test C: protocol-relative URL resolves with browser base protocol and target host", () => {
			const originalDocument = (globalThis as any).document;
			const originalWindow = (globalThis as any).window;
			try {
				(globalThis as any).document = { baseURI: browserOrigin };
				(globalThis as any).window = { location: { href: browserOrigin, protocol: "https:", host: "other.example", hostname: "other.example" } };

				const httpbinValidator = new AllowedHostsValidator(new Set(["httpbin.org"]));
				const otherValidator = new AllowedHostsValidator(new Set(["other.example"]));

				// //httpbin.org/path replaces authority with httpbin.org, using https: from browser base
				expect(httpbinValidator.isUrlHostValid("//httpbin.org/path")).to.be.true;
				expect(otherValidator.isUrlHostValid("//httpbin.org/path")).to.be.false;
			} finally {
				if (originalDocument === undefined) delete (globalThis as any).document;
				else (globalThis as any).document = originalDocument;
				if (originalWindow === undefined) delete (globalThis as any).window;
				else (globalThis as any).window = originalWindow;
			}
		});

		it("Test D: root-relative URL resolves against browser base origin", () => {
			const originalDocument = (globalThis as any).document;
			const originalWindow = (globalThis as any).window;
			try {
				(globalThis as any).document = { baseURI: browserOrigin };
				(globalThis as any).window = { location: { href: browserOrigin, protocol: "https:", host: "other.example", hostname: "other.example" } };

				const otherValidator = new AllowedHostsValidator(new Set(["other.example"]));
				const httpbinValidator = new AllowedHostsValidator(new Set(["httpbin.org"]));

				expect(otherValidator.isUrlHostValid("/api")).to.be.true;
				expect(httpbinValidator.isUrlHostValid("/api")).to.be.false;
			} finally {
				if (originalDocument === undefined) delete (globalThis as any).document;
				else (globalThis as any).document = originalDocument;
				if (originalWindow === undefined) delete (globalThis as any).window;
				else (globalThis as any).window = originalWindow;
			}
		});

		it("Test E: path-relative URL resolves against browser base URL", () => {
			const originalDocument = (globalThis as any).document;
			const originalWindow = (globalThis as any).window;
			try {
				(globalThis as any).document = { baseURI: browserOrigin };
				(globalThis as any).window = { location: { href: browserOrigin, protocol: "https:", host: "other.example", hostname: "other.example" } };

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
			} finally {
				if (originalDocument === undefined) delete (globalThis as any).document;
				else (globalThis as any).document = originalDocument;
				if (originalWindow === undefined) delete (globalThis as any).window;
				else (globalThis as any).window = originalWindow;
			}
		});

		it("Test F: existing non-browser bare-host behavior is preserved in Node.js", () => {
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
		});

		it("Test H: actual fetch destination consistency between authentication and request execution", async () => {
			const originalDocument = (globalThis as any).document;
			const originalWindow = (globalThis as any).window;
			const inNodeSpy = vi.spyOn(utils, "inNodeEnv").mockReturnValue(false);
			try {
				(globalThis as any).document = { baseURI: browserOrigin };
				(globalThis as any).window = { location: { href: browserOrigin, protocol: "https:", host: "other.example", hostname: "other.example" } };

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
				const otherProvider = new ApiKeyAuthenticationProvider("secret-api-key", "X-API-KEY", ApiKeyLocation.Header, new Set(["other.example"]));
				const req2 = new RequestInformation();
				req2.URL = "httpbin.org/path";

				await otherProvider.authenticateRequest(req2);

				// Prove: credentials WERE attached because the browser destination is other.example
				expect(req2.headers.tryGetValue("X-API-KEY")).to.deep.equal(["secret-api-key"]);

				// Verify actual destination matches the validated host
				const actualDestination2 = new URL(req2.URL, browserOrigin);
				expect(actualDestination2.hostname).to.equal("other.example");
				expect(otherProvider["validator"].isUrlHostValid(actualDestination2.href)).to.be.true;

				// 3. Explicit absolute URL to httpbin.org
				const req3 = new RequestInformation();
				req3.URL = "https://httpbin.org/path";

				await httpbinProvider.authenticateRequest(req3);

				// Prove: credentials WERE attached because explicit absolute URL goes to httpbin.org
				expect(req3.headers.tryGetValue("X-API-KEY")).to.deep.equal(["secret-api-key"]);
				const actualDestination3 = new URL(req3.URL, browserOrigin);
				expect(actualDestination3.hostname).to.equal("httpbin.org");
				expect(httpbinProvider["validator"].isUrlHostValid(actualDestination3.href)).to.be.true;
			} finally {
				inNodeSpy.mockRestore();
				if (originalDocument === undefined) delete (globalThis as any).document;
				else (globalThis as any).document = originalDocument;
				if (originalWindow === undefined) delete (globalThis as any).window;
				else (globalThis as any).window = originalWindow;
			}
		});
	});
});
