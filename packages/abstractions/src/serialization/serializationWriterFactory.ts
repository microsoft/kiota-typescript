/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { SerializationWriter } from "./serializationWriter";

/** Defines the contract for a factory that creates SerializationWriter instances. */
export interface SerializationWriterFactory {
	/**
	 * Gets the content type this factory creates serialization writers for.
	 * @return the content type this factory creates serialization writers for.
	 */
	getValidContentType(): string;
	/**
	 * Creates a new SerializationWriter instance for the given content type.
	 * @param contentType the content type to create a serialization writer for.
	 * @return a new SerializationWriter instance for the given content type.
	 */
	getSerializationWriter(contentType: string): SerializationWriter;
}
