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

	it("getAllowedHosts should return correct hosts", () => {
		expect(JSON.stringify(validator.getAllowedHosts())).to.equal(JSON.stringify(["example.com", "test.com"]));
	});

	it("setAllowedHosts should update allowed hosts", () => {
		validator.setAllowedHosts(new Set(["newhost.com"]));
		expect(JSON.stringify(validator.getAllowedHosts())).to.equal(JSON.stringify(["newhost.com"]));
	});

	it("setAllowedHosts should validate new hosts", () => {
		expect(() => validator.setAllowedHosts(new Set(["https://invalid.com"]))).to.throw("host should not contain http or https prefix");
	});

	it("isUrlHostValid should return true for valid hosts", () => {
		expect(validator.isUrlHostValid("http://example.com/path")).to.be.true;
		expect(validator.isUrlHostValid("http://test.com/path")).to.be.true;
	});

	it("isUrlHostValid should return false for invalid hosts", () => {
		expect(validator.isUrlHostValid("http://invalid.com/path")).to.be.false;
	});

	it("isUrlHostValid should return false for invalid URLs", () => {
		expect(validator.isUrlHostValid("invalid")).to.be.false;
	});
});
