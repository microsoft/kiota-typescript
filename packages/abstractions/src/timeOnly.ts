/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { formatSegment } from "./dateOnly";
/*
 * Represents a time only. ISO 8601.
 */
export class TimeOnly implements TimeOnlyInterface {
	/**
	 * Creates a new TimeOnly from the given parameters.
	 * @param root0 The hours, minutes, seconds, and milliseconds
	 * @param root0.hours The hours
	 * @param root0.minutes The minutes
	 * @param root0.seconds The seconds
	 * @param root0.picoseconds The milliseconds
	 * @returns The new TimeOnly
	 * @throws An error if the milliseconds are invalid
	 * @throws An error if the seconds are invalid
	 * @throws An error if the minutes are invalid
	 * @throws An error if the hours are invalid
	 * @throws An error if the milliseconds are invalid
	 */
	public constructor({ hours = 0, minutes = 0, seconds = 0, picoseconds = 0 }: Partial<TimeOnlyInterface>) {
		if (hours < 0 || hours > 23) {
			throw new Error("Hour must be between 0 and 23");
		}
		if (minutes < 0 || minutes > 59) {
			throw new Error("Minute must be between 0 and 59");
		}
		if (seconds < 0 || seconds > 59) {
			throw new Error("Second must be between 0 and 59");
		}
		if (picoseconds < 0 || picoseconds > 9999999) {
			throw new Error("Millisecond must be between 0 and 9999999");
		}
		this.hours = hours;
		this.minutes = minutes;
		this.seconds = seconds;
		this.picoseconds = picoseconds;
	}
	public hours: number;
	public minutes: number;
	public seconds: number;
	public picoseconds: number;
	/**
	 * Creates a new TimeOnly from the given date.
	 * @param date The date
	 * @returns The new TimeOnly
	 * @throws An error if the date is invalid
	 */
	public static fromDate(date: Date): TimeOnly {
		if (!date) {
			throw new Error("Date cannot be undefined");
		}
		return new TimeOnly({
			hours: date.getHours(),
			minutes: date.getMinutes(),
			seconds: date.getSeconds(),
			picoseconds: date.getMilliseconds() * 10000,
		});
	}
	/**
	 * Parses a string into a TimeOnly. The string can be of the ISO 8601 time only format or a number representing the ticks of a Date.
	 * @param value The value to parse
	 * @returns The parsed TimeOnly.
	 * @throws An error if the value is invalid
	 */
	public static parse(value: string | undefined): TimeOnly | undefined {
		if (!value || value.length === 0) {
			return undefined;
		}
		const ticks = Date.parse(value);
		if (isNaN(ticks)) {
			// not using name groups as it's an ES2018 feature
			const exec = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(?:[.](\d{1,12}))?$/gi.exec(value);
			if (exec) {
				const hours = parseInt(exec[1] ?? "", 10);
				const minutes = parseInt(exec[2] ?? "", 10);
				const seconds = parseInt(exec[3] ?? "", 10);
				const milliseconds = parseInt(exec[4] ?? "0", 10);
				return new TimeOnly({
					hours,
					minutes,
					seconds,
					picoseconds: milliseconds,
				});
			} else {
				throw new Error("Value is not a valid time-only representation");
			}
		} else {
			const date = new Date(ticks);
			return this.fromDate(date);
		}
	}
	/**
	 * Returns a string representation of the time in the format HH:MM:SS.SSSSSSS
	 * @returns The time in the format HH:MM:SS.SSSSSSS
	 * @throws An error if the time is invalid
	 */
	public toString(): string {
		return `${formatSegment(this.hours, 2)}:${formatSegment(this.minutes, 2)}:${formatSegment(this.seconds, 2)}.${formatSegment(this.picoseconds, 7)}`;
	}
}
interface TimeOnlyInterface {
	/**
	 * The hours
	 * @default 0
	 */
	hours: number;
	/**
	 * The minutes
	 * @default 0
	 */
	minutes: number;
	/**
	 * The seconds
	 * @default 0
	 */
	seconds: number;
	/**
	 * The milliseconds
	 * @default 0
	 */
	picoseconds: number;
}
