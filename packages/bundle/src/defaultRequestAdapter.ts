/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { AuthenticationProvider, ParseNodeFactory, ParseNodeFactoryRegistry, registerDefaultDeserializer, registerDefaultSerializer, SerializationWriterFactory, SerializationWriterFactoryRegistry } from "@microsoft/kiota-abstractions";
import { FormParseNodeFactory, FormSerializationWriterFactory } from "@microsoft/kiota-serialization-form";
import { JsonParseNodeFactory, JsonSerializationWriterFactory } from "@microsoft/kiota-serialization-json";
import { MultipartSerializationWriterFactory } from "@microsoft/kiota-serialization-multipart";
import { TextParseNodeFactory, TextSerializationWriterFactory } from "@microsoft/kiota-serialization-text";
import { FetchRequestAdapter, HttpClient, type ObservabilityOptions, ObservabilityOptionsImpl } from "@microsoft/kiota-http-fetchlibrary";
import { BackingStoreFactory } from "@microsoft/kiota-abstractions/src";

/**
 * Default request adapter for graph clients. Bootstraps serialization and other aspects.
 */
export class DefaultRequestAdapter extends FetchRequestAdapter {
	/**
	 * Instantiates a new request adapter.
	 * @param authenticationProvider the authentication provider to use.
	 * @param parseNodeFactory the parse node factory to deserialize responses.
	 * @param serializationWriterFactory the serialization writer factory to use to serialize request bodies.
	 * @param httpClient the http client to use to execute requests.
	 * @param observabilityOptions the observability options to use.
	 */
	public constructor(authenticationProvider: AuthenticationProvider, parseNodeFactory: ParseNodeFactory = new ParseNodeFactoryRegistry(), serializationWriterFactory: SerializationWriterFactory = new SerializationWriterFactoryRegistry(), httpClient: HttpClient = new HttpClient(), observabilityOptions: ObservabilityOptions = new ObservabilityOptionsImpl()) {
		super(authenticationProvider, parseNodeFactory, serializationWriterFactory, httpClient, observabilityOptions);
		this.setupDefaults();
	}

	private setupDefaults() {
		let parseNodeFactoryRegistry: ParseNodeFactoryRegistry;
		if (super.getParseNodeFactory() instanceof ParseNodeFactoryRegistry) {
			parseNodeFactoryRegistry = super.getParseNodeFactory() as ParseNodeFactoryRegistry;
		} else {
			throw new Error("ParseNodeFactory must be a ParseNodeFactoryRegistry");
		}

		let serializationWriterFactoryRegistry: SerializationWriterFactoryRegistry;
		if (super.getSerializationWriterFactory() instanceof SerializationWriterFactoryRegistry) {
			serializationWriterFactoryRegistry = super.getSerializationWriterFactory() as SerializationWriterFactoryRegistry;
		} else {
			throw new Error("SerializationWriterFactory must be a SerializationWriterFactoryRegistry");
		}

		const backingStoreFactory = super.getBackingStoreFactory();
		registerDefaultSerializer(serializationWriterFactoryRegistry, JsonSerializationWriterFactory, backingStoreFactory);
		registerDefaultSerializer(serializationWriterFactoryRegistry, TextSerializationWriterFactory, backingStoreFactory);
		registerDefaultSerializer(serializationWriterFactoryRegistry, FormSerializationWriterFactory, backingStoreFactory);
		registerDefaultSerializer(serializationWriterFactoryRegistry, MultipartSerializationWriterFactory, backingStoreFactory);
		registerDefaultDeserializer(parseNodeFactoryRegistry, JsonParseNodeFactory, backingStoreFactory);
		registerDefaultDeserializer(parseNodeFactoryRegistry, TextParseNodeFactory, backingStoreFactory);
		registerDefaultDeserializer(parseNodeFactoryRegistry, FormParseNodeFactory, backingStoreFactory);
	}
}
