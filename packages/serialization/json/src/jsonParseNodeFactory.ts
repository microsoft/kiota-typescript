/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { ParseNode, ParseNodeFactory } from "@microsoft/kiota-abstractions";

import { JsonParseNode } from "./jsonParseNode";

export class JsonParseNodeFactory implements ParseNodeFactory {
	public getValidContentType(): string {
		return "application/json";
	}
	public getRootParseNode(contentType: string, content: ArrayBuffer): ParseNode {
		if (!content) {
			throw new Error("content cannot be undefined of empty");
		} else if (!contentType) {
			throw new Error("content type cannot be undefined or empty");
		} else if (this.getValidContentType() !== contentType) {
			throw new Error(`expected a ${this.getValidContentType()} content type`);
		}
		return new JsonParseNode(this.convertArrayBufferToJson(content));
	}

	private convertArrayBufferToJson(content: ArrayBuffer) {
		const decoder = new TextDecoder();
		const contentAsStr = decoder.decode(content);
		return JSON.parse(contentAsStr);
	}
}
