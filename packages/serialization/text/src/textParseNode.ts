/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { DateOnly, Duration, type Parsable, type ParsableFactory, parseGuidString, type ParseNode, TimeOnly, inNodeEnv, getEnumValueFromStringValue } from "@microsoft/kiota-abstractions";

/**
 * This class represents a text parse node.
 */
export class TextParseNode implements ParseNode {
	private static readonly noStructuredDataMessage = "text does not support structured data";
	constructor(private readonly text: string) {
		if (this.text && this.text.length > 1 && this.text.startsWith('"') && this.text.endsWith('"')) {
			this.text = this.text.substring(1, this.text.length - 2);
		}
	}
	public getByteArrayValue(): ArrayBuffer | undefined {
		const strValue = this.getStringValue();
		if (strValue && strValue.length > 0) {
			/**
			 * Node.js Buffer objects created via Buffer.from() use a shared memory pool
			 * and may be subject to reuse/recycling, which can lead to unexpected behavior.
			 *
			 * For consistent behavior across environments:
			 * - In Node: We convert the base64 string to a Buffer first, then create a new
			 *   Uint8Array from it to ensure we have a stable, independent copy
			 * - In browsers: We convert the string directly using TextEncoder
			 *
			 * TODO: Consider standardizing on a cross-platform UInt8Array.fromBase64 (after the API is stabilized across browsers)
			 * in the future instead of the current environment-specific approach
			 */
			return inNodeEnv() ? new Uint8Array(Buffer.from(strValue, "base64")).buffer : new TextEncoder().encode(strValue);
		}
		return undefined;
	}
	public onBeforeAssignFieldValues: ((value: Parsable) => void) | undefined;
	public onAfterAssignFieldValues: ((value: Parsable) => void) | undefined;
	public getStringValue = () => this.text;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public getChildNode = (identifier: string): ParseNode | undefined => {
		throw new Error(TextParseNode.noStructuredDataMessage);
	};
	public getBooleanValue = (): boolean | undefined => {
		const value = this.getStringValue()?.toLowerCase();
		if (value === "true" || value === "1") {
			return true;
		} else if (value === "false" || value === "0") {
			return false;
		}
		return undefined;
	};
	public getNumberValue = () => Number(this.text);
	public getGuidValue = () => parseGuidString(this.text);
	public getDateValue = () => new Date(Date.parse(this.text));
	public getDateOnlyValue = () => DateOnly.parse(this.getStringValue());
	public getTimeOnlyValue = () => TimeOnly.parse(this.getStringValue());
	public getDurationValue = () => Duration.parse(this.getStringValue());
	public getCollectionOfPrimitiveValues = <T>(): T[] | undefined => {
		throw new Error(TextParseNode.noStructuredDataMessage);
	};
	/* eslint-disable @typescript-eslint/no-unused-vars */
	public getCollectionOfObjectValues<T extends Parsable>(parsableFactory: ParsableFactory<T>): T[] | undefined {
		throw new Error(TextParseNode.noStructuredDataMessage);
	}

	/* eslint-disable @typescript-eslint/no-unused-vars */
	public getObjectValue<T extends Parsable>(parsableFactory: ParsableFactory<T>): T {
		throw new Error(TextParseNode.noStructuredDataMessage);
	}

	public getCollectionOfEnumValues = <T>(type: any): T[] => {
		throw new Error(TextParseNode.noStructuredDataMessage);
	};
	public getEnumValue = <T>(type: any): T | undefined => {
		const rawValue = this.getStringValue();
		if (!rawValue) {
			return undefined;
		}
		return getEnumValueFromStringValue(rawValue, type as Record<PropertyKey, PropertyKey>) as T;
	};
}
