/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { BackingStoreFactory, createBackedModelProxyHandler, DateOnly, Duration, type Parsable, type ParsableFactory, parseGuidString, type ParseNode, TimeOnly, isBackingStoreEnabled, getEnumValueFromStringValue } from "@microsoft/kiota-abstractions";

export class FormParseNode implements ParseNode {
	private readonly _fields: Record<string, string> = {};
	/**
	 *  Creates a new instance of FormParseNode
	 * @param _rawString the raw string to parse
	 * @param backingStoreFactory the factory to create backing stores
	 */
	constructor(
		private readonly _rawString: string,
		private readonly backingStoreFactory?: BackingStoreFactory,
	) {
		if (!_rawString) {
			throw new Error("rawString cannot be undefined");
		}
		_rawString
			.split("&")
			.map((x) => x.split("="))
			.filter((x) => x.length === 2)
			.forEach((x) => {
				const key = this.normalizeKey(x[0]);
				if (this._fields[key]) {
					this._fields[key] += "," + x[1];
				} else {
					this._fields[key] = x[1];
				}
			});
	}
	private normalizeKey(key: string): string {
		return decodeURIComponent(key).trim();
	}
	private getStringValueFromRaw(value: string): string {
		return decodeURIComponent(value);
	}
	private getBooleanValueFromRaw(value: string): boolean | undefined {
		const decoded = this.getStringValueFromRaw(value).toLowerCase();
		if (decoded === "true" || decoded === "1") {
			return true;
		} else if (decoded === "false" || decoded === "0") {
			return false;
		}
		return undefined;
	}
	private getNumberValueFromRaw(value: string): number {
		return parseFloat(this.getStringValueFromRaw(value));
	}
	private getGuidValueFromRaw(value: string): string | undefined {
		return parseGuidString(this.getStringValueFromRaw(value));
	}
	private getDateValueFromRaw(value: string): Date {
		return new Date(Date.parse(this.getStringValueFromRaw(value)));
	}
	private getDateOnlyValueFromRaw(value: string): DateOnly | undefined {
		return DateOnly.parse(this.getStringValueFromRaw(value));
	}
	private getTimeOnlyValueFromRaw(value: string): TimeOnly | undefined {
		return TimeOnly.parse(this.getStringValueFromRaw(value));
	}
	private getDurationValueFromRaw(value: string): Duration | undefined {
		return Duration.parse(this.getStringValueFromRaw(value));
	}
	public getByteArrayValue(): ArrayBuffer | undefined {
		throw new Error("serialization of byt arrays is not supported with URI encoding");
	}
	public onBeforeAssignFieldValues: ((value: Parsable) => void) | undefined;
	public onAfterAssignFieldValues: ((value: Parsable) => void) | undefined;
	public getStringValue = (): string => this.getStringValueFromRaw(this._rawString);
	public getChildNode = (identifier: string): ParseNode | undefined => {
		if (this._fields[identifier]) {
			return new FormParseNode(this._fields[identifier], this.backingStoreFactory);
		}
		return undefined;
	};
	public getBooleanValue = () => this.getBooleanValueFromRaw(this._rawString);
	public getNumberValue = () => this.getNumberValueFromRaw(this._rawString);
	public getGuidValue = () => this.getGuidValueFromRaw(this._rawString);
	public getDateValue = () => this.getDateValueFromRaw(this._rawString);
	public getDateOnlyValue = () => this.getDateOnlyValueFromRaw(this._rawString);
	public getTimeOnlyValue = () => this.getTimeOnlyValueFromRaw(this._rawString);
	public getDurationValue = () => this.getDurationValueFromRaw(this._rawString);
	public getCollectionOfPrimitiveValues = <T>(): T[] | undefined => {
		const values = this._rawString.split(",");
		return values.map((x) => {
			const typeOfX = typeof x;
			if (typeOfX === "boolean") {
				return this.getBooleanValueFromRaw(x) as unknown as T;
			} else if (typeOfX === "string") {
				return this.getStringValueFromRaw(x) as unknown as T;
			} else if (typeOfX === "number") {
				return this.getNumberValueFromRaw(x) as unknown as T;
			} else if (x instanceof Date) {
				return this.getDateValueFromRaw(x as unknown as string) as unknown as T;
			} else if (x instanceof DateOnly) {
				return this.getDateOnlyValueFromRaw(x as unknown as string) as unknown as T;
			} else if (x instanceof TimeOnly) {
				return this.getTimeOnlyValueFromRaw(x as unknown as string) as unknown as T;
			} else if (x instanceof Duration) {
				return this.getDurationValueFromRaw(x as unknown as string) as unknown as T;
			} else {
				throw new Error(`encountered an unknown type during deserialization ${typeof x}`);
			}
		});
	};
	public getCollectionOfObjectValues = <T extends Parsable>(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		parsableFactory: ParsableFactory<T>,
	): T[] | undefined => {
		throw new Error(`serialization of collections is not supported with URI encoding`);
	};
	public getObjectValue = <T extends Parsable>(parsableFactory: ParsableFactory<T>): T => {
		const temp: T = {} as T;
		const enableBackingStore = isBackingStoreEnabled(parsableFactory(this)(temp));
		const value: T = enableBackingStore && this.backingStoreFactory ? new Proxy(temp, createBackedModelProxyHandler<T>(this.backingStoreFactory)) : temp;
		if (this.onBeforeAssignFieldValues) {
			this.onBeforeAssignFieldValues(value);
		}
		this.assignFieldValues(value, parsableFactory);
		if (this.onAfterAssignFieldValues) {
			this.onAfterAssignFieldValues(value);
		}
		return value;
	};
	public getCollectionOfEnumValues = <T>(type: any): T[] => {
		const rawValues = this.getStringValue();
		if (!rawValues) {
			return [];
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		return rawValues.split(",").map((x) => getEnumValueFromStringValue(x, type) as T);
	};
	public getEnumValue = <T>(type: any): T | undefined => {
		const rawValue = this.getStringValue();
		if (!rawValue) {
			return undefined;
		}
		return getEnumValueFromStringValue(rawValue, type as Record<PropertyKey, PropertyKey>) as T;
	};
	private assignFieldValues<T extends Parsable>(model: T, parsableFactory: ParsableFactory<T>): void {
		const fields = parsableFactory(this)(model);
		Object.entries(this._fields)
			.filter((x) => !/^null$/i.test(x[1]))
			.forEach(([k, v]) => {
				const deserializer = fields[k];
				if (deserializer) {
					deserializer(new FormParseNode(v, this.backingStoreFactory));
				} else {
					(model as Record<string, unknown>)[k] = v;
				}
			});
	}
}
