/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import type { Parsable } from "./parsable";
import type { ParseNode } from "./parseNode";
import type { SerializationWriter } from "./serializationWriter";

export type ModelSerializerFunction<T extends Parsable> = (writer: SerializationWriter, value?: Partial<T> | null | undefined) => void;

export type DeserializeIntoModelFunction<T extends Parsable> = (value?: Partial<T> | null | undefined) => Record<string, (node: ParseNode) => void>;
