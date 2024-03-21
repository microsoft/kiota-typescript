/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
export function toFirstCharacterUpper(source?: string): string {
  if (source && source.length > 0) {
    return source.substring(0, 1).toLocaleUpperCase() + source.substring(1);
  } else {
    return "";
  }
}
