/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { AuthenticationProvider, ParseNodeFactory, ParseNodeFactoryRegistry, SerializationWriterFactory, SerializationWriterFactoryRegistry } from "@microsoft/kiota-abstractions";
import { FormParseNodeFactory, FormSerializationWriterFactory } from "@microsoft/kiota-serialization-form";
import { JsonParseNodeFactory, JsonSerializationWriterFactory } from "@microsoft/kiota-serialization-json";
import { MultipartSerializationWriterFactory } from "@microsoft/kiota-serialization-multipart";
import { TextParseNodeFactory, TextSerializationWriterFactory } from "@microsoft/kiota-serialization-text";
import { FetchRequestAdapter, HttpClient, type ObservabilityOptions, ObservabilityOptionsImpl } from "@microsoft/kiota-http-fetchlibrary";

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
		const parseNodeFactoryRegistry = super.getParseNodeFactory() as ParseNodeFactoryRegistry;
		const serializationWriterFactoryRegistry = super.getSerializationWriterFactory() as SerializationWriterFactoryRegistry;
		const backingStoreFactory = super.getBackingStoreFactory();
		if (parseNodeFactoryRegistry.registerDefaultDeserializer) {
			parseNodeFactoryRegistry.registerDefaultDeserializer(TextParseNodeFactory, backingStoreFactory);
			parseNodeFactoryRegistry.registerDefaultDeserializer(JsonParseNodeFactory, backingStoreFactory);
			parseNodeFactoryRegistry.registerDefaultDeserializer(FormParseNodeFactory, backingStoreFactory);
		}

		if (serializationWriterFactoryRegistry.registerDefaultSerializer) {
			serializationWriterFactoryRegistry.registerDefaultSerializer(JsonSerializationWriterFactory);
			serializationWriterFactoryRegistry.registerDefaultSerializer(TextSerializationWriterFactory);
			serializationWriterFactoryRegistry.registerDefaultSerializer(FormSerializationWriterFactory);
			serializationWriterFactoryRegistry.registerDefaultSerializer(MultipartSerializationWriterFactory);
		}
	}
}
