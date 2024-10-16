/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { NativeResponseHandler } from "./nativeResponseHandler";
import type { RequestOption } from "./requestOption";
import type { ResponseHandler } from "./responseHandler";

type originalCallType<modelType, queryParametersType, headersType> = (q?: queryParametersType, h?: headersType, o?: RequestOption[], responseHandler?: ResponseHandler) => Promise<modelType>;
type originalCallWithBodyType<modelType, queryParametersType, headersType, requestBodyType> = (requestBody: requestBodyType, q?: queryParametersType, h?: headersType, o?: RequestOption[], responseHandler?: ResponseHandler) => Promise<modelType>;

/** This class can be used to wrap a request using the fluent API and get the native response object in return. */
export class NativeResponseWrapper {
	public static CallAndGetNative = async <modelType, nativeResponseType, queryParametersType, headersType>(originalCall: originalCallType<modelType, queryParametersType, headersType>, q?: queryParametersType, h?: headersType, o?: RequestOption[]): Promise<nativeResponseType> => {
		const responseHandler = new NativeResponseHandler();
		await originalCall(q, h, o, responseHandler);
		return responseHandler.value as nativeResponseType;
	};
	public static CallAndGetNativeWithBody = async <modelType, nativeResponseType, queryParametersType, headersType, requestBodyType>(originalCall: originalCallWithBodyType<modelType, queryParametersType, headersType, requestBodyType>, requestBody: requestBodyType, q?: queryParametersType, h?: headersType, o?: RequestOption[]): Promise<nativeResponseType> => {
		const responseHandler = new NativeResponseHandler();
		await originalCall(requestBody, q, h, o, responseHandler);
		return responseHandler.value as nativeResponseType;
	};
}
