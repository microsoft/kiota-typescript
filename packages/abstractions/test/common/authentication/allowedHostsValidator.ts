/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { expect, describe, beforeEach, it } from "vitest";
import { AllowedHostsValidator } from "../../../src/authentication";

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
				expect(otherValidator.isUrlHostValid("other.com/path")).to.be.true;
				expect(otherValidator.isUrlHostValid("example.com/path")).to.be.false;
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

	it("isUrlHostValid should resolve relative URLs against document.baseURI when available", () => {
		const allowedValidator = new AllowedHostsValidator(new Set(["allowed.example"]));
		const otherValidator = new AllowedHostsValidator(new Set(["other.example"]));

		const originalDocument = (globalThis as any).document;
		const originalWindow = (globalThis as any).window;

		try {
			(globalThis as any).document = {
				baseURI: "https://other.example/",
			};
			(globalThis as any).window = {
				location: {
					protocol: "https:",
					host: "allowed.example",
					hostname: "allowed.example",
					href: "https://allowed.example/page",
				},
			};

			// When document.baseURI is other.example, /api resolves to other.example, NOT allowed.example
			expect(allowedValidator.isUrlHostValid("/api")).to.be.false;
			expect(otherValidator.isUrlHostValid("/api")).to.be.true;
		} finally {
			if (originalDocument === undefined) {
				delete (globalThis as any).document;
			} else {
				(globalThis as any).document = originalDocument;
			}
			if (originalWindow === undefined) {
				delete (globalThis as any).window;
			} else {
				(globalThis as any).window = originalWindow;
			}
		}
	});
});
