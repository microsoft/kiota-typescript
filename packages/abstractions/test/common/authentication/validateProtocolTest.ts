import { validateProtocol, isLocalhostUrl } from "../../../src/authentication";
import { describe, it, expect } from "vitest";

describe("validateProtocol", () => {
	// TODO: fix this test
	// it('should throw an error for non-https and non-localhost URLs', () => {
	//     expect(() => validateProtocol('http://example.com')).to.throw('Authentication scheme can only be used with https requests');
	// });

	it("should not throw an error for https URLs", () => {
		expect(() => validateProtocol("https://example.com")).to.not.throw();
	});

	it("should not throw an error for localhost URLs", () => {
		expect(() => validateProtocol("http://localhost")).to.not.throw();
		expect(() => validateProtocol("HTTP://LOCALHOST")).to.not.throw();
		expect(() => validateProtocol("http://127.0.0.1")).to.not.throw();
		expect(() => validateProtocol("http://[::1]")).to.not.throw();
	});
});

describe("isLocalhostUrl", () => {
	it("should return true for localhost URLs", () => {
		expect(isLocalhostUrl("http://localhost")).to.be.true;
		expect(isLocalhostUrl("http://127.0.0.1")).to.be.true;
		expect(isLocalhostUrl("http://[::1]")).to.be.true;
	});

	it("should return false for non-localhost URLs", () => {
		expect(isLocalhostUrl("https://example.com")).to.be.false;
	});

	it("should return false for invalid URLs", () => {
		expect(isLocalhostUrl("not a url")).to.be.false;
	});
});
