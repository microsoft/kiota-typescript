/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { type ErrorMappings } from "./requestAdapter";

/** Defines the contract for a response handler. */
export interface ResponseHandler {
	/**
	 * Callback method that is invoked when a response is received.
	 * @param response The native response object.
	 * @param errorMappings the error factories mapping to use in case of a failed request.
	 * @typeParam NativeResponseType The type of the native response object.
	 * @typeParam ModelType The type of the response model object.
	 * @return A {@link Promise} that represents the asynchronous operation and contains the deserialized response.
	 */
	handleResponse<NativeResponseType, ModelType>(response: NativeResponseType, errorMappings: ErrorMappings | undefined): Promise<ModelType | undefined>;
}
