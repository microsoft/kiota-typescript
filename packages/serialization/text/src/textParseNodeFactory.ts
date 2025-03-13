/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { ParseNode, ParseNodeFactory } from "@microsoft/kiota-abstractions";

import { TextParseNode } from "./textParseNode";
import { BackingStoreFactory } from "@microsoft/kiota-abstractions/src";

export class TextParseNodeFactory implements ParseNodeFactory {
	/**
	 * Creates an instance of TextParseNode.
	 * @param backingStoreFactory - The factory to create backing stores.
	 */
	constructor(private readonly backingStoreFactory: BackingStoreFactory) {}
	public getValidContentType(): string {
		return "text/plain";
	}
	public getRootParseNode(contentType: string, content: ArrayBuffer): ParseNode {
		if (!content) {
			throw new Error("content cannot be undefined of empty");
		} else if (!contentType) {
			throw new Error("content type cannot be undefined or empty");
		} else if (this.getValidContentType() !== contentType) {
			throw new Error(`expected a ${this.getValidContentType()} content type`);
		}
		return new TextParseNode(this.convertArrayBufferToText(content));
	}

	private convertArrayBufferToText(arrayBuffer: ArrayBuffer) {
		const decoder = new TextDecoder();
		return decoder.decode(arrayBuffer);
	}
}
