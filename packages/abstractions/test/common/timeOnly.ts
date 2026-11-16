/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { TimeOnly } from "../../src/timeOnly";

describe("TimeOnly", () => {
	describe("parse", () => {
		it("parses time string without fractional seconds", () => {
			const result = TimeOnly.parse("12:30:45");
			assert.isDefined(result);
			assert.equal(result?.hours, 12);
			assert.equal(result?.minutes, 30);
			assert.equal(result?.seconds, 45);
			assert.equal(result?.picoseconds, 0);
			assert.equal(result?.toString(), "12:30:45.0000000");
		});

		it("parses time string with 1-digit fractional seconds", () => {
			const result = TimeOnly.parse("12:30:45.5");
			assert.isDefined(result);
			assert.equal(result?.hours, 12);
			assert.equal(result?.minutes, 30);
			assert.equal(result?.seconds, 45);
			assert.equal(result?.picoseconds, 5000000);
			assert.equal(result?.toString(), "12:30:45.5000000");
		});

		it("parses time string with 3-digit fractional seconds", () => {
			const result = TimeOnly.parse("12:30:45.123");
			assert.isDefined(result);
			assert.equal(result?.hours, 12);
			assert.equal(result?.minutes, 30);
			assert.equal(result?.seconds, 45);
			assert.equal(result?.picoseconds, 1230000);
			assert.equal(result?.toString(), "12:30:45.1230000");
		});

		it("parses time string with exact 7-digit fractional seconds", () => {
			const result = TimeOnly.parse("12:30:45.1234567");
			assert.isDefined(result);
			assert.equal(result?.hours, 12);
			assert.equal(result?.minutes, 30);
			assert.equal(result?.seconds, 45);
			assert.equal(result?.picoseconds, 1234567);
			assert.equal(result?.toString(), "12:30:45.1234567");
		});

		it("parses time string with leading zeros in fractional seconds", () => {
			const result = TimeOnly.parse("12:30:45.001234567");
			assert.isDefined(result);
			assert.equal(result?.hours, 12);
			assert.equal(result?.minutes, 30);
			assert.equal(result?.seconds, 45);
			assert.equal(result?.picoseconds, 12345);
			assert.equal(result?.toString(), "12:30:45.0012345");
		});

		it("truncates fractional seconds beyond 7 digits without throwing", () => {
			const result8 = TimeOnly.parse("12:30:45.12345678");
			assert.isDefined(result8);
			assert.equal(result8?.picoseconds, 1234567);
			assert.equal(result8?.toString(), "12:30:45.1234567");

			const result12 = TimeOnly.parse("12:30:45.123456789012");
			assert.isDefined(result12);
			assert.equal(result12?.picoseconds, 1234567);
		});

		it("returns undefined for empty or undefined input", () => {
			assert.isUndefined(TimeOnly.parse(""));
			assert.isUndefined(TimeOnly.parse(undefined));
		});

		it("falls back to parsing date string when given full ISO timestamp", () => {
			const result = TimeOnly.parse("2023-01-01T12:30:45.500Z");
			assert.isDefined(result);
			const expectedDate = new Date(Date.parse("2023-01-01T12:30:45.500Z"));
			assert.equal(result?.hours, expectedDate.getHours());
			assert.equal(result?.minutes, expectedDate.getMinutes());
			assert.equal(result?.seconds, expectedDate.getSeconds());
			assert.equal(result?.picoseconds, expectedDate.getMilliseconds() * 10000);
		});

		it("throws for invalid time representations", () => {
			assert.throws(() => TimeOnly.parse("invalid"), /not a valid time-only representation/);
			assert.throws(() => TimeOnly.parse("25:00:00"), /not a valid time-only representation/);
			assert.throws(() => TimeOnly.parse("12:60:00"), /not a valid time-only representation/);
			assert.throws(() => TimeOnly.parse("not-a-time"), /not a valid time-only representation/);
		});
	});

	describe("fromDate", () => {
		it("creates TimeOnly from Date object", () => {
			const date = new Date(2023, 0, 1, 14, 25, 30, 500);
			const result = TimeOnly.fromDate(date);
			assert.equal(result.hours, 14);
			assert.equal(result.minutes, 25);
			assert.equal(result.seconds, 30);
			assert.equal(result.picoseconds, 5000000);
			assert.equal(result.toString(), "14:25:30.5000000");
		});

		it("throws when date is undefined or null", () => {
			assert.throws(() => TimeOnly.fromDate(undefined as unknown as Date), /Date cannot be undefined/);
		});
	});

	describe("constructor validation", () => {
		it("validates hours boundary", () => {
			assert.throws(() => new TimeOnly({ hours: -1 }), /Hour must be between 0 and 23/);
			assert.throws(() => new TimeOnly({ hours: 24 }), /Hour must be between 0 and 23/);
		});

		it("validates minutes boundary", () => {
			assert.throws(() => new TimeOnly({ minutes: -1 }), /Minute must be between 0 and 59/);
			assert.throws(() => new TimeOnly({ minutes: 60 }), /Minute must be between 0 and 59/);
		});

		it("validates seconds boundary", () => {
			assert.throws(() => new TimeOnly({ seconds: -1 }), /Second must be between 0 and 59/);
			assert.throws(() => new TimeOnly({ seconds: 60 }), /Second must be between 0 and 59/);
		});

		it("validates picoseconds boundary", () => {
			assert.throws(() => new TimeOnly({ picoseconds: -1 }), /Millisecond must be between 0 and 9999999/);
			assert.throws(() => new TimeOnly({ picoseconds: 10000000 }), /Millisecond must be between 0 and 9999999/);
		});
	});

	describe("toString", () => {
		it("formats time with padded numbers", () => {
			const time = new TimeOnly({ hours: 1, minutes: 2, seconds: 3, picoseconds: 4 });
			assert.equal(time.toString(), "01:02:03.0000004");
		});
	});
});
