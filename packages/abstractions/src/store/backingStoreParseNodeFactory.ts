/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { type ParseNodeFactory, ParseNodeProxyFactory } from "../serialization";
import type { BackedModel } from "./backedModel";

/** Proxy implementation of ParseNodeFactory for the backing store that automatically sets the state of the backing store when deserializing. */
export class BackingStoreParseNodeFactory extends ParseNodeProxyFactory {
	/**
	 * Initializes a new instance of the BackingStoreParseNodeFactory class given the concrete implementation.
	 * @param concrete the concrete implementation of the ParseNodeFactory
	 */
	public constructor(concrete: ParseNodeFactory) {
		super(
			concrete,
			(value) => {
				const backedModel = value as unknown as BackedModel;
				if (backedModel?.backingStore) {
					backedModel.backingStore.initializationCompleted = false;
				}
			},
			(value) => {
				const backedModel = value as unknown as BackedModel;
				if (backedModel?.backingStore) {
					backedModel.backingStore.initializationCompleted = true;
				}
			},
		);
	}
}
