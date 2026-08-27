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
});
