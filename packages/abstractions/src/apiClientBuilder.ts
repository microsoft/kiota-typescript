/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { ParseNodeFactoryRegistry, type SerializationWriterFactory, SerializationWriterFactoryRegistry } from "./serialization";
import { BackingStoreSerializationWriterProxyFactory } from "./store";

/**
 * Enables the backing store on default serialization writers and the given serialization writer.
 * @param serializationWriterFactoryRegistry The serialization writer factory registry to enable the backing store on.
 * @param parseNodeFactoryRegistry The parse node factory registry to enable the backing store on.
 * @param original The serialization writer to enable the backing store on.
 * @returns A new serialization writer with the backing store enabled.
 */
export function enableBackingStoreForSerializationWriterFactory(serializationWriterFactoryRegistry: SerializationWriterFactoryRegistry, parseNodeFactoryRegistry: ParseNodeFactoryRegistry, original: SerializationWriterFactory): SerializationWriterFactory {
	if (!original) throw new Error("Original must be specified");
	let result = original;
	if (original instanceof SerializationWriterFactoryRegistry) {
		original.enableBackingStoreForSerializationRegistry();
	} else {
		result = new BackingStoreSerializationWriterProxyFactory(original);
	}
	serializationWriterFactoryRegistry.enableBackingStoreForSerializationRegistry();
	parseNodeFactoryRegistry.enableBackingStoreForParseNodeRegistry();
	return result;
}
