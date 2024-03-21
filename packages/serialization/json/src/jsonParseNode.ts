import { createBackedModelProxyHandler, DateOnly, Duration, type Parsable, type ParsableFactory, parseGuidString, type ParseNode, TimeOnly, isBackingStoreEnabled, toFirstCharacterUpper, isUntypedNode, UntypedNode, UntypedArray, UntypedBoolean, UntypedNumber, UntypedObject, UntypedString, createUntypedNodeFromDiscriminatorValue, UntypedNull, createUntypedBoolean, createUntypedString, createUntypedNumber, createUntypedArray, createUntypedObject, createUntypedNull } from "@microsoft/kiota-abstractions";

export class JsonParseNode implements ParseNode {
	/**
	 *
	 */
	constructor(private readonly _jsonNode: unknown) {}
	public onBeforeAssignFieldValues: ((value: Parsable) => void) | undefined;
	public onAfterAssignFieldValues: ((value: Parsable) => void) | undefined;
	public getStringValue = () => this._jsonNode as string;
	public getChildNode = (identifier: string): ParseNode | undefined => (this._jsonNode && typeof this._jsonNode === "object" && (this._jsonNode as { [key: string]: any })[identifier] !== undefined ? new JsonParseNode((this._jsonNode as { [key: string]: any })[identifier]) : undefined);
	public getBooleanValue = () => this._jsonNode as boolean;
	public getNumberValue = () => this._jsonNode as number;
	public getGuidValue = () => parseGuidString(this.getStringValue());
	public getDateValue = () => (this._jsonNode ? new Date(this._jsonNode as string) : undefined);
	public getDateOnlyValue = () => DateOnly.parse(this.getStringValue());
	public getTimeOnlyValue = () => TimeOnly.parse(this.getStringValue());
	public getDurationValue = () => Duration.parse(this.getStringValue());
	public getCollectionOfPrimitiveValues = <T>(): T[] | undefined => {
		return (this._jsonNode as unknown[]).map((x) => {
			const currentParseNode = new JsonParseNode(x);
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
			return Buffer.from(strValue, "base64").buffer;
		}
		return undefined;
	}
	public getCollectionOfObjectValues = <T extends Parsable>(method: ParsableFactory<T>): T[] | undefined => {
		return this._jsonNode ? (this._jsonNode as unknown[]).map((x) => new JsonParseNode(x)).map((x) => x.getObjectValue<T>(method)) : undefined;
	};

	public getObjectValue = <T extends Parsable>(parsableFactory: ParsableFactory<T>): T => {
		const temp: T = {} as T;
		if (isUntypedNode(parsableFactory(this)(temp))) {
			const valueType = typeof this._jsonNode;
			let value: T = temp;
			if (valueType === "boolean") {
				value = createUntypedBoolean(this._jsonNode as boolean) as any as T;
			} else if (valueType === "string") {
				value = createUntypedString(this._jsonNode as string) as any as T;
			} else if (valueType === "number") {
				value = createUntypedNumber(this._jsonNode as number) as any as T;
			} else if (Array.isArray(this._jsonNode)) {
				const nodes: UntypedNode[] = [];
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				(this._jsonNode as any[]).forEach((x) => {
					nodes.push(new JsonParseNode(x).getObjectValue(createUntypedNodeFromDiscriminatorValue));
				});
				value = createUntypedArray(nodes) as any as T;
			} else if (this._jsonNode && valueType === "object") {
				const properties: Record<string, UntypedNode> = {};
				Object.entries(this._jsonNode as any).forEach(([k, v]) => {
					properties[k] = new JsonParseNode(v).getObjectValue(createUntypedNodeFromDiscriminatorValue);
				});
				value = createUntypedObject(properties) as any as T;
			} else if (!this._jsonNode) {
				value = createUntypedNull() as any as T;
			}
			return value;
		}
		const enableBackingStore = isBackingStoreEnabled(parsableFactory(this)(temp));
		const value: T = enableBackingStore ? new Proxy(temp, createBackedModelProxyHandler<T>()) : temp;
		if (this.onBeforeAssignFieldValues) {
			this.onBeforeAssignFieldValues(value);
		}
		this.assignFieldValues(value, parsableFactory);
		if (this.onAfterAssignFieldValues) {
			this.onAfterAssignFieldValues(value);
		}
		return value;
	};

	private assignFieldValues = <T extends Parsable>(model: T, parsableFactory: ParsableFactory<T>): void => {
		const fields = parsableFactory(this)(model);
		if (!this._jsonNode) return;
		Object.entries(this._jsonNode as any).forEach(([k, v]) => {
			const deserializer = fields[k];
			if (deserializer) {
				deserializer(new JsonParseNode(v));
			} else {
				// additional properties
				(model as Record<string, unknown>)[k] = v;
			}
		});
	};
	public getCollectionOfEnumValues = <T>(type: any): T[] => {
		if (Array.isArray(this._jsonNode)) {
			return this._jsonNode
				.map((x) => {
					const node = new JsonParseNode(x);
					return node.getEnumValue(type) as T;
				})
				.filter(Boolean);
		}
		return [];
	};
	public getEnumValue = <T>(type: any): T | undefined => {
		const rawValue = this.getStringValue();
		if (!rawValue) {
			return undefined;
		}
		return type[toFirstCharacterUpper(rawValue)];
	};
}
