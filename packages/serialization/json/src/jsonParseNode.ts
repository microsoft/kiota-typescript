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
	public getStringValue = () => (typeof this._jsonNode === "string" ? this._jsonNode : undefined);
	public getChildNode = (identifier: string): ParseNode | undefined => (this._jsonNode && typeof this._jsonNode === "object" && (this._jsonNode as Record<string, unknown>)[identifier] !== undefined ? new JsonParseNode((this._jsonNode as Record<string, unknown>)[identifier], this.backingStoreFactory) : undefined);
	public getBooleanValue = () => (typeof this._jsonNode === "boolean" ? this._jsonNode : undefined);
	public getNumberValue = () => (typeof this._jsonNode === "number" ? this._jsonNode : undefined);
	public getGuidValue = () => parseGuidString(this.getStringValue());
	public getDateValue = () => (this._jsonNode ? new Date(this._jsonNode as string) : undefined);
	public getDateOnlyValue = () => DateOnly.parse(this.getStringValue());
	public getTimeOnlyValue = () => TimeOnly.parse(this.getStringValue());
	public getDurationValue = () => Duration.parse(this.getStringValue());
	public getCollectionOfPrimitiveValues = <T>(): T[] | undefined => {
		if (!Array.isArray(this._jsonNode)) {
			return undefined;
		}
		return (this._jsonNode as unknown[]).map((x) => {
			const currentParseNode = new JsonParseNode(x, this.backingStoreFactory);
			const typeOfX = typeof x;
			if (typeOfX === "boolean") {
				return currentParseNode.getBooleanValue() as unknown as T;
			} else if (typeOfX === "string") {
				return currentParseNode.getStringValue() as unknown as T;
			} else if (typeOfX === "number") {
				return currentParseNode.getNumberValue() as unknown as T;
			} else if (x instanceof Date) {
				return currentParseNode.getDateValue() as unknown as T;
			} else if (x instanceof DateOnly) {
				return currentParseNode.getDateValue() as unknown as T;
			} else if (x instanceof TimeOnly) {
				return currentParseNode.getDateValue() as unknown as T;
			} else if (x instanceof Duration) {
				return currentParseNode.getDateValue() as unknown as T;
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
			return inNodeEnv() ? new Uint8Array(Buffer.from(strValue, "base64")).buffer : new TextEncoder().encode(strValue);
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
				.map((x) => {
					const node = new JsonParseNode(x, this.backingStoreFactory);
					return node.getEnumValue(type) as T;
				})
				.filter(Boolean);
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
