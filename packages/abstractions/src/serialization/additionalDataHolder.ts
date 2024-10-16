/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/** Defines a contract for models that can hold additional data besides the described properties. */
export interface AdditionalDataHolder {
	/**
	 * Gets the additional data for this object that did not belong to the properties.
	 * @return The additional data for this object.
	 */
	additionalData?: Record<string, unknown>;
}
