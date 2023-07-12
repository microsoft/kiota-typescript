/* eslint-disable @typescript-eslint/no-unused-vars */
import { DateOnly, Duration, Parsable, ParsableFactory, ParseNode, ParseNodeFactory, TimeOnly } from "@microsoft/kiota-abstractions";
import { Guid } from "guid-typescript";

export class MockParseNodeFactory implements ParseNodeFactory {
	parseNodeValue: ParseNode;
	/**
	 *
	 */
	constructor(parseNodeValue: ParseNode) {
		this.parseNodeValue = parseNodeValue;
	}
	getValidContentType(): string {
		return "application/json";
	}
	getRootParseNode(contentType: string, content: ArrayBuffer): ParseNode {
		return this.parseNodeValue;
	}
}

export class MockParseNode implements ParseNode {
	returnObjectValue: Parsable;
	/**
	 *
	 */
	constructor(returnObjectValue: Parsable) {
		this.returnObjectValue = returnObjectValue;
	}
	getStringValue(): string {
		throw new Error("Method not implemented.");
	}
	getChildNode(identifier: string): ParseNode {
		throw new Error("Method not implemented.");
	}
	getBooleanValue(): boolean {
		throw new Error("Method not implemented.");
	}
	getNumberValue(): number {
		throw new Error("Method not implemented.");
	}
	getGuidValue(): Guid {
		throw new Error("Method not implemented.");
	}
	getDateValue(): Date {
		throw new Error("Method not implemented.");
	}
	getDurationValue(): Duration | undefined {
		throw new Error("Method not implemented.");
	}
	getDateOnlyValue(): DateOnly | undefined {
		throw new Error("Method not implemented.");
	}
	getTimeOnlyValue(): TimeOnly | undefined {
		throw new Error("Method not implemented.");
	}
	getCollectionOfPrimitiveValues<T>(): T[] | undefined {
		throw new Error("Method not implemented.");
	}
	getCollectionOfObjectValues<T extends Parsable>(type: ParsableFactory<T>): T[] | undefined {
		throw new Error("Method not implemented.");
	}
	getObjectValue<T extends Parsable>(type: ParsableFactory<T>): T {
		return this.returnObjectValue as unknown as T;
	}
	getCollectionOfEnumValues<T>(type: any): T[] {
		throw new Error("Method not implemented.");
	}
	getEnumValue<T>(type: any): T | undefined {
		throw new Error("Method not implemented.");
	}
	onBeforeAssignFieldValues: ((value: Parsable) => void) | undefined;
	onAfterAssignFieldValues: ((value: Parsable) => void) | undefined;
}
