/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import type { FetchRequestInit } from "../utils/fetchDefinitions";

/** Counts followed redirects per request, including when a custom fetch returns responses without URL metadata. */
export const followedRedirects = new WeakMap<FetchRequestInit, number>();
