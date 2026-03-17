/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { BackingStoreFactory, DateOnly, Duration, TimeOnly, UntypedNode, createBackedModelProxyHandler, createUntypedArray, createUntypedBoolean, createUntypedNodeFromDiscriminatorValue, createUntypedNull, createUntypedNumber, createUntypedObject, createUntypedString, inNodeEnv, isBackingStoreEnabled, isUntypedNode, parseGuidString, getEnumValueFromStringValue, type Parsable, type ParsableFactory, type ParseNode, AdditionalDataHolder } from "@microsoft/kiota-abstractions";

export class JsonParseNode implements ParseNode {
	/**
	 * Creates an instance of JsonParseNode.
	 * @param _jsonNode - The JSON node to parse.
	 * @param backingStoreFactory - The factory to create backing stores.
	 */
	constructor(
		private readonly _jsonNode: unknown,
		private readonly backingStoreFactory?: BackingStoreFactory,
	) {}
	public onBeforeAssignFieldValues: ((value: Parsable) => void) | undefined;
	public onAfterAssignFieldValues: ((value: Parsable) => void) | undefined;
	private readonly getStringValueFromRaw = (value: unknown): string | undefined => (typeof value === "string" ? value : undefined);
	private readonly getGuidValueFromRaw = (value: unknown): string | undefined => parseGuidString(this.getStringValueFromRaw(value));
	private readonly getDateValueFromRaw = (value: unknown): Date | undefined => {
		if (value instanceof Date) {
			return value;
		}
		if (typeof value === "number") {
			return new Date(value);
		}
		if (typeof value === "string") {
			return new Date(value);
		}
		return undefined;
	};
	private readonly getDateOnlyValueFromRaw = (value: unknown): DateOnly | undefined => (value instanceof DateOnly ? value : DateOnly.parse(this.getStringValueFromRaw(value)));
	private readonly getTimeOnlyValueFromRaw = (value: unknown): TimeOnly | undefined => (value instanceof TimeOnly ? value : TimeOnly.parse(this.getStringValueFromRaw(value)));
	private readonly getDurationValueFromRaw = (value: unknown): Duration | undefined => (value instanceof Duration ? value : Duration.parse(this.getStringValueFromRaw(value)));
	public getStringValue = () => this.getStringValueFromRaw(this._jsonNode);
	public getChildNode = (identifier: string): ParseNode | undefined => (this._jsonNode && typeof this._jsonNode === "object" && (this._jsonNode as Record<string, unknown>)[identifier] !== undefined ? new JsonParseNode((this._jsonNode as Record<string, unknown>)[identifier], this.backingStoreFactory) : undefined);
	public getBooleanValue = (): boolean | undefined => (typeof this._jsonNode === "boolean" ? this._jsonNode : undefined);
	public getNumberValue = (): number | undefined => (typeof this._jsonNode === "number" ? this._jsonNode : undefined);
	public getGuidValue = () => this.getGuidValueFromRaw(this._jsonNode);
	public getDateValue = () => this.getDateValueFromRaw(this._jsonNode);
	public getDateOnlyValue = () => this.getDateOnlyValueFromRaw(this._jsonNode);
	public getTimeOnlyValue = () => this.getTimeOnlyValueFromRaw(this._jsonNode);
	public getDurationValue = () => this.getDurationValueFromRaw(this._jsonNode);
	public getCollectionOfPrimitiveValues = <T>(): T[] | undefined => {
		if (!Array.isArray(this._jsonNode)) {
			return undefined;
		}
		return (this._jsonNode as unknown[]).map((x) => {
			const typeOfX = typeof x;
			if (x === null) {
				return null as T;
			} else if (typeOfX === "boolean") {
				return x as unknown as T;
			} else if (typeOfX === "string") {
				return x as unknown as T;
			} else if (typeOfX === "number") {
				return x as unknown as T;
			} else if (x instanceof Date) {
				return this.getDateValueFromRaw(x) as unknown as T;
			} else if (x instanceof DateOnly) {
				return this.getDateOnlyValueFromRaw(x) as unknown as T;
			} else if (x instanceof TimeOnly) {
				return this.getTimeOnlyValueFromRaw(x) as unknown as T;
			} else if (x instanceof Duration) {
				return this.getDurationValueFromRaw(x) as unknown as T;
			} else {
				throw new Error(`encountered an unknown type during deserialization ${typeof x}`);
			}
		});
	};
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
			return inNodeEnv() ? new Uint8Array(Buffer.from(strValue, "base64")).buffer : new TextEncoder().encode(strValue).buffer;
		}
		return undefined;
	}
	public getCollectionOfObjectValues = <T extends Parsable>(method: ParsableFactory<T>): T[] | undefined => {
		if (!Array.isArray(this._jsonNode)) {
			return undefined;
		}
		return this._jsonNode ? (this._jsonNode as unknown[]).map((x) => new JsonParseNode(x, this.backingStoreFactory)).map((x) => x.getObjectValue<T>(method)) : undefined;
	};

	public getObjectValue = <T extends Parsable>(parsableFactory: ParsableFactory<T>): T => {
		const temp: T = {} as T;
		if (isUntypedNode(parsableFactory(this)(temp))) {
			const valueType = typeof this._jsonNode;
			let value: T = temp;
			if (valueType === "boolean") {
				value = createUntypedBoolean(this._jsonNode as boolean) as unknown as T;
			} else if (valueType === "string") {
				value = createUntypedString(this._jsonNode as string) as unknown as T;
			} else if (valueType === "number") {
				value = createUntypedNumber(this._jsonNode as number) as unknown as T;
			} else if (Array.isArray(this._jsonNode)) {
				const nodes: UntypedNode[] = [];

				this._jsonNode.forEach((x) => {
					nodes.push(new JsonParseNode(x, this.backingStoreFactory).getObjectValue(createUntypedNodeFromDiscriminatorValue));
				});
				value = createUntypedArray(nodes) as unknown as T;
			} else if (this._jsonNode && valueType === "object") {
				const properties: Record<string, UntypedNode> = {};
				Object.entries(this._jsonNode).forEach(([k, v]) => {
					properties[k] = new JsonParseNode(v, this.backingStoreFactory).getObjectValue(createUntypedNodeFromDiscriminatorValue);
				});
				value = createUntypedObject(properties) as unknown as T;
			} else if (!this._jsonNode) {
				value = createUntypedNull() as unknown as T;
			}
			return value;
		}
		const enableBackingStore = isBackingStoreEnabled(parsableFactory(this)(temp));
		const objectValue: T = enableBackingStore && this.backingStoreFactory ? new Proxy(temp, createBackedModelProxyHandler<T>(this.backingStoreFactory)) : temp;
		if (this.onBeforeAssignFieldValues) {
			this.onBeforeAssignFieldValues(objectValue);
		}
		this.assignFieldValues(objectValue, parsableFactory);
		if (this.onAfterAssignFieldValues) {
			this.onAfterAssignFieldValues(objectValue);
		}
		return objectValue;
	};

	private readonly assignFieldValues = <T extends Parsable>(model: T, parsableFactory: ParsableFactory<T>): void => {
		const fields = parsableFactory(this)(model);
		if (!this._jsonNode) return;
		Object.entries(this._jsonNode).forEach(([k, v]) => {
			const deserializer = fields[k];
			if (deserializer) {
				deserializer(new JsonParseNode(v, this.backingStoreFactory));
			} else {
				// there is no real way to test if the model is actually a holder or not
				// additional properties
				const modelDataHolder = model as AdditionalDataHolder;
				modelDataHolder.additionalData ??= {} as Record<string, unknown>;
				modelDataHolder.additionalData[k] = v;
			}
		});
	};
	public getCollectionOfEnumValues = <T>(type: unknown): T[] => {
		if (Array.isArray(this._jsonNode)) {
			return this._jsonNode
				.map<T | undefined>((x) => {
					if (typeof x === "string") {
						return getEnumValueFromStringValue(x, type as Record<PropertyKey, PropertyKey>) as T;
					}
					return undefined;
				})
				.filter((value): value is T => value !== undefined);
		}
		return [];
	};

	public getEnumValue = <T>(type: unknown): T | undefined => {
		const rawValue = this.getStringValue();
		if (!rawValue) {
			return undefined;
		}
		return getEnumValueFromStringValue(rawValue, type as Record<PropertyKey, PropertyKey>) as T;
	};
}
