/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { DateOnly } from "./dateOnly";
import type { Duration } from "./duration";
import { type RequestInformation } from "./requestInformation";
import type { Parsable, ParsableFactory, ParseNodeFactory, SerializationWriterFactory } from "./serialization";
import { type BackingStoreFactory } from "./store";
import type { TimeOnly } from "./timeOnly";

/** Service responsible for translating abstract Request Info into concrete native HTTP requests. */
export interface RequestAdapter {
	/**
	 * Gets the serialization writer factory currently in use for the HTTP core service.
	 * @returns the serialization writer factory currently in use for the HTTP core service.
	 */
	getSerializationWriterFactory(): SerializationWriterFactory;
	/**
	 * Gets the parse node factory currently in use for the HTTP core service.
	 * @returns the parse node factory currently in use for the HTTP core service.
	 */
	getParseNodeFactory(): ParseNodeFactory;
	/** * Gets the backing store factory currently in use for the HTTP core service. *
	 * @returns The backing store factory currently in use for the HTTP core service.
	 */
	getBackingStoreFactory(): BackingStoreFactory;
	/**
	 * Executes the HTTP request specified by the given RequestInformation and returns the deserialized response model.
	 * @param requestInfo the request info to execute.
	 * @param type the class of the response model to deserialize the response into.
	 * @param errorMappings the error factories mapping to use in case of a failed request.
	 * @returns a {@link Promise} with the deserialized response model.
	 */
	send<ModelType extends Parsable>(requestInfo: RequestInformation, type: ParsableFactory<ModelType>, errorMappings: ErrorMappings | undefined): Promise<ModelType | undefined>;
	/**
	 * Executes the HTTP request specified by the given RequestInformation and returns the deserialized response model collection.
	 * @param requestInfo the request info to execute.
	 * @param type the class of the response model to deserialize the response into.
	 * @param errorMappings the error factories mapping to use in case of a failed request.
	 * @returns a {@link Promise} with the deserialized response model collection.
	 */
	sendCollection<ModelType extends Parsable>(requestInfo: RequestInformation, type: ParsableFactory<ModelType>, errorMappings: ErrorMappings | undefined): Promise<ModelType[] | undefined>;
	/**
	 * Executes the HTTP request specified by the given RequestInformation and returns the deserialized response model collection.
	 * @param requestInfo the request info to execute.
	 * @param responseType the class of the response model to deserialize the response into.
	 * @param errorMappings the error factories mapping to use in case of a failed request.
	 * @returns a {@link Promise} with the deserialized response model collection.
	 */
	sendCollectionOfPrimitive<ResponseType extends Exclude<PrimitiveTypesForDeserializationType, ArrayBuffer>>(requestInfo: RequestInformation, responseType: Exclude<PrimitiveTypesForDeserialization, "ArrayBuffer">, errorMappings: ErrorMappings | undefined): Promise<ResponseType[] | undefined>;
	/**
	 * Executes the HTTP request specified by the given RequestInformation and returns the deserialized primitive response model.
	 * @param requestInfo the request info to execute.
	 * @param responseType the class of the response model to deserialize the response into.
	 * @param errorMappings the error factories mapping to use in case of a failed request.
	 * @returns a {@link Promise} with the deserialized primitive response model.
	 */
	sendPrimitive<ResponseType extends PrimitiveTypesForDeserializationType>(requestInfo: RequestInformation, responseType: PrimitiveTypesForDeserialization, errorMappings: ErrorMappings | undefined): Promise<ResponseType | undefined>;
	/**
	 * Executes the HTTP request specified by the given RequestInformation and returns the deserialized primitive response model.
	 * @param requestInfo the request info to execute.
	 * @param errorMappings the error factories mapping to use in case of a failed request.
	 * @returns a {@link Promise} of void.
	 */
	sendNoResponseContent(requestInfo: RequestInformation, errorMappings: ErrorMappings | undefined): Promise<void>;
	/**
	 * Executes the HTTP request specified by the given RequestInformation and returns the deserialized enum response model.
	 * @template EnumObject - The type of the enum object. Must extend Record<string, unknown>.
	 * @param requestInfo - The request info to execute.
	 * @param enumObject - The Enum object expected in the response.
	 * @param errorMappings - the error factories mapping to use in case of a failed request.
	 * @returns A promise that resolves to the response of the request, or undefined if an error occurred.
	 */
	sendEnum<EnumObject extends Record<string, unknown>>(requestInfo: RequestInformation, enumObject: EnumObject, errorMappings: ErrorMappings | undefined): Promise<EnumObject[keyof EnumObject] | undefined>;
	/**
	 * Executes the HTTP request specified by the given RequestInformation and returns the deserialized response model collection.
	 * @template EnumObject - The type of the enum objects. Must extend Record<string, unknown>.
	 * @param requestInfo - The request info to execute.
	 * @param enumObject - The Enum object expected in the response.
	 * @param errorMappings - the error factories mapping to use in case of a failed request.
	 * @returns a promise with the deserialized response model collection.
	 */
	sendCollectionOfEnum<EnumObject extends Record<string, unknown>>(requestInfo: RequestInformation, enumObject: EnumObject, errorMappings: ErrorMappings | undefined): Promise<EnumObject[keyof EnumObject][] | undefined>;
	/**
	 * Enables the backing store proxies for the SerializationWriters and ParseNodes in use.
	 * @param backingStoreFactory the backing store factory to use.
	 */
	enableBackingStore(backingStoreFactory?: BackingStoreFactory): void;
	/** The base url for every request. */
	baseUrl: string;
	/**
	 * Converts the given RequestInformation into a native HTTP request used by the implementing adapter.
	 * @param requestInfo the request info to convert.
	 * @returns a {@link Promise} with the native request.
	 */
	convertToNativeRequest<T>(requestInfo: RequestInformation): Promise<T>;
}
export interface ErrorMappings {
	_4XX?: ParsableFactory<Parsable>;
	_5XX?: ParsableFactory<Parsable>;
	XXX?: ParsableFactory<Parsable>;
	[key: number]: ParsableFactory<Parsable>;
}

export type PrimitiveTypesForDeserializationType = string | number | boolean | Date | DateOnly | TimeOnly | Duration | ArrayBuffer;

export type PrimitiveTypesForDeserialization = "string" | "number" | "boolean" | "Date" | "DateOnly" | "TimeOnly" | "Duration" | "ArrayBuffer";

export type SendMethods = Exclude<keyof RequestAdapter, "enableBackingStore" | "getSerializationWriterFactory" | "convertToNativeRequest" | "baseUrl">;
