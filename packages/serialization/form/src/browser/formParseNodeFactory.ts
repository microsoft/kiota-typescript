/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { BackingStoreFactory, ParseNode, ParseNodeFactory } from "@microsoft/kiota-abstractions";

import { FormParseNode } from "./../formParseNode";

export class FormParseNodeFactory implements ParseNodeFactory {
	/**
	 * Creates an instance of JsonParseNode.
	 * @param backingStoreFactory - The factory to create backing stores.
	 */
	constructor(private readonly backingStoreFactory?: BackingStoreFactory) {}
	public getValidContentType(): string {
		return "application/x-www-form-urlencoded";
	}
	public getRootParseNode(contentType: string, content: ArrayBuffer): ParseNode {
		if (!content) {
			throw new Error("content cannot be undefined of empty");
		} else if (!contentType) {
			throw new Error("content type cannot be undefined or empty");
		} else if (this.getValidContentType() !== contentType) {
			throw new Error(`expected a ${this.getValidContentType()} content type`);
		}
		return new FormParseNode(this.convertArrayBufferToString(content), this.backingStoreFactory);
	}

	private convertArrayBufferToString(content: ArrayBuffer) {
		const decoder = new TextDecoder();
		return decoder.decode(content);
	}
}
