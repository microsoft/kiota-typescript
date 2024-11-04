/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * Represents a date only. ISO 8601.
 */
export class DateOnly implements DateOnlyInterface {
	/**
	 * Creates a new DateOnly from the given string.
	 * @param root0 The year, month, and day
	 * @param root0.year The year
	 * @param root0.month The month
	 * @param root0.day The day
	 * @returns The new DateOnly
	 * @throws An error if the year is invalid
	 * @throws An error if the month is invalid
	 * @throws An error if the day is invalid
	 */
	public constructor({ year = 0, month = 1, day = 1 }: Partial<DateOnlyInterface>) {
		this.day = day;
		this.month = month;
		this.year = year;
	}
	public year: number;
	public month: number;
	public day: number;
	/**
	 * Creates a new DateOnly from the given date.
	 * @param date The date
	 * @returns The new DateOnly
	 * @throws An error if the date is invalid
	 */
	public static fromDate(date: Date): DateOnly {
		if (!date) {
			throw new Error("Date cannot be undefined");
		}
		const result = new DateOnly({
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate(),
		});
		return result;
	}
	/**
	 * Parses a string into a DateOnly. The string can be of the ISO 8601 time only format or a number representing the ticks of a Date.
	 * @param value The value to parse
	 * @returns The parsed DateOnly.
	 * @throws An error if the value is invalid
	 */
	public static parse(value: string | undefined): DateOnly | undefined {
		if (!value || value.length === 0) {
			return undefined;
		}
		// not using name groups as it's an ES2018 feature
		const exec = /^(\d{4,})-(0[1-9]|1[012])-(0[1-9]|[12]\d|3[01])$/gi.exec(value);
		if (exec) {
			const year = parseInt(exec[1], 10);
			const month = parseInt(exec[2], 10);
			const day = parseInt(exec[3], 10);
			return new DateOnly({ year, month, day });
		}
		const ticks = Date.parse(value);
		if (!isNaN(ticks)) {
			const date = new Date(ticks);
			return this.fromDate(date);
		}
		throw new Error(`Value is not a valid date-only representation: ${value}`);
	}
	/**
	 *  Returns a string representation of the date in the format YYYY-MM-DD
	 * @returns The date in the format YYYY-MM-DD ISO 8601
	 */
	public toString(): string {
		return `${formatSegment(this.year, 4)}-${formatSegment(this.month)}-${formatSegment(this.day)}`;
	}
}
interface DateOnlyInterface {
	/**
	 * The year
	 * @default 0
	 */
	year: number;
	/**
	 * The month
	 * @default 1
	 */
	month: number;
	/**
	 * The day
	 * @default 1
	 */
	day: number;
}
/**
 * Formats a segment of a date to a string
 * @param segment The segment to format
 * @param digits The number of digits to pad
 * @returns The formatted segment
 */
export function formatSegment(segment: number, digits = 2): string {
	return segment.toString().padStart(digits, "0");
}
