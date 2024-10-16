/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { Parsable } from "./parsable";
import type { SerializationWriter } from "./serializationWriter";
import type { SerializationWriterFactory } from "./serializationWriterFactory";

/** Proxy factory that allows the composition of before and after callbacks on existing factories. */
export abstract class SerializationWriterProxyFactory implements SerializationWriterFactory {
	public getValidContentType(): string {
		return this._concrete.getValidContentType();
	}
	/**
	 * Creates a new proxy factory that wraps the specified concrete factory while composing the before and after callbacks.
	 * @param _concrete the concrete factory to wrap
	 * @param _onBefore the callback to invoke before the serialization of any model object.
	 * @param _onAfter the callback to invoke after the serialization of any model object.
	 * @param _onStart the callback to invoke when the serialization of a model object starts
	 */
	constructor(
		private readonly _concrete: SerializationWriterFactory,
		private readonly _onBefore?: ((value: Parsable) => void) | undefined,
		private readonly _onAfter?: ((value: Parsable) => void) | undefined,
		private readonly _onStart?: ((value: Parsable, writer: SerializationWriter) => void) | undefined,
	) {
		if (!_concrete) {
			throw new Error("_concrete cannot be undefined");
		}
	}
	public getSerializationWriter(contentType: string): SerializationWriter {
		const writer = this._concrete.getSerializationWriter(contentType);
		const originalBefore = writer.onBeforeObjectSerialization;
		const originalAfter = writer.onAfterObjectSerialization;
		const originalStart = writer.onStartObjectSerialization;
		writer.onBeforeObjectSerialization = (value) => {
			if (this._onBefore) this._onBefore(value);
			if (originalBefore) originalBefore(value);
		};
		writer.onAfterObjectSerialization = (value) => {
			if (this._onAfter) this._onAfter(value);
			if (originalAfter) originalAfter(value);
		};
		writer.onStartObjectSerialization = (value, writer_) => {
			if (this._onStart) this._onStart(value, writer_);
			if (originalStart) originalStart(value, writer_);
		};
		return writer;
	}
}
