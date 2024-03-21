/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { Guid } from "guid-typescript";

export function parseGuidString(source?: string): Guid | undefined {
  if (source && Guid.isGuid(source)) {
    return Guid.parse(source);
  } else {
    return undefined;
  }
}