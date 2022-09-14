import { ApiError, AuthenticationProvider, BackingStoreFactory, BackingStoreFactorySingleton, DateOnly, Duration, enableBackingStoreForParseNodeFactory, enableBackingStoreForSerializationWriterFactory, Parsable, ParsableFactory, ParseNode,ParseNodeFactory, ParseNodeFactoryRegistry, RequestAdapter, RequestInformation, ResponseHandler, SerializationWriterFactory, SerializationWriterFactoryRegistry, TimeOnly } from "@microsoft/kiota-abstractions";

import { HttpClient } from "./httpClient";

export class FetchRequestAdapter implements RequestAdapter {
	/** The base url for every request. */
	public baseUrl = "";
	public getSerializationWriterFactory(): SerializationWriterFactory {
		return this.serializationWriterFactory;
	}
	/**
	 * Instantiates a new http core service
	 * @param authenticationProvider the authentication provider to use.
	 * @param parseNodeFactory the parse node factory to deserialize responses.
	 * @param serializationWriterFactory the serialization writer factory to use to serialize request bodies.
	 * @param httpClient the http client to use to execute requests.
	 */
	public constructor(public readonly authenticationProvider: AuthenticationProvider, private parseNodeFactory: ParseNodeFactory = ParseNodeFactoryRegistry.defaultInstance, private serializationWriterFactory: SerializationWriterFactory = SerializationWriterFactoryRegistry.defaultInstance, private readonly httpClient: HttpClient = new HttpClient()) {
		if (!authenticationProvider) {
			throw new Error("authentication provider cannot be null");
		}
		if (!parseNodeFactory) {
			throw new Error("parse node factory cannot be null");
		}
		if (!serializationWriterFactory) {
			throw new Error("serialization writer factory cannot be null");
		}
		if (!httpClient) {
			throw new Error("http client cannot be null");
		}
	}
	private getResponseContentType = (response: Response): string | undefined => {
		const header = response.headers.get("content-type")?.toLowerCase();
		if (!header) return undefined;
		const segments = header.split(";");
		if (segments.length === 0) return undefined;
		else return segments[0];
	};
	public sendCollectionOfPrimitiveAsync = async <ResponseType>(requestInfo: RequestInformation, responseType: "string" | "number" | "boolean" | "Date", responseHandler: ResponseHandler | undefined, errorMappings: Record<string, ParsableFactory<Parsable>> | undefined): Promise<ResponseType[] | undefined> => {
		if (!requestInfo) {
			throw new Error("requestInfo cannot be null");
		}
		const response = await this.getHttpResponseMessage(requestInfo);
		if (responseHandler) {
			return await responseHandler.handleResponseAsync(response, errorMappings);
		} else {
			try {
				await this.throwFailedResponses(response, errorMappings);
				if (this.shouldReturnUndefined(response)) return undefined;
				switch (responseType) {
					case "string":
					case "number":
					case "boolean":
					case "Date":
						// eslint-disable-next-line no-case-declarations
						const rootNode = await this.getRootParseNode(response);
						if (responseType === "string") {
							return rootNode.getCollectionOfPrimitiveValues<string>() as unknown as ResponseType[];
						} else if (responseType === "number") {
							return rootNode.getCollectionOfPrimitiveValues<number>() as unknown as ResponseType[];
						} else if (responseType === "boolean") {
							return rootNode.getCollectionOfPrimitiveValues<boolean>() as unknown as ResponseType[];
						} else if (responseType === "Date") {
							return rootNode.getCollectionOfPrimitiveValues<Date>() as unknown as ResponseType[];
						} else if (responseType === "Duration") {
							return rootNode.getCollectionOfPrimitiveValues<Duration>() as unknown as ResponseType[];
						} else if (responseType === "DateOnly") {
							return rootNode.getCollectionOfPrimitiveValues<DateOnly>() as unknown as ResponseType[];
						} else if (responseType === "TimeOnly") {
							return rootNode.getCollectionOfPrimitiveValues<TimeOnly>() as unknown as ResponseType[];
						} else {
							throw new Error("unexpected type to deserialize");
						}
				}
			} finally {
				await this.purgeResponseBody(response);
			}
		}
	};
	public sendCollectionAsync = async <ModelType extends Parsable>(requestInfo: RequestInformation, type: ParsableFactory<ModelType>, responseHandler: ResponseHandler | undefined, errorMappings: Record<string, ParsableFactory<Parsable>> | undefined): Promise<ModelType[] | undefined> => {
		if (!requestInfo) {
			throw new Error("requestInfo cannot be null");
		}
		const response = await this.getHttpResponseMessage(requestInfo);
		if (responseHandler) {
			return await responseHandler.handleResponseAsync(response, errorMappings);
		} else {
			try {
				await this.throwFailedResponses(response, errorMappings);
				if (this.shouldReturnUndefined(response)) return undefined;
				const rootNode = await this.getRootParseNode(response);
				const result = rootNode.getCollectionOfObjectValues(type);
				return result as unknown as ModelType[];
			} finally {
				await this.purgeResponseBody(response);
			}
		}
	};
	public sendAsync = async <ModelType extends Parsable>(requestInfo: RequestInformation, type: ParsableFactory<ModelType>, responseHandler: ResponseHandler | undefined, errorMappings: Record<string, ParsableFactory<Parsable>> | undefined): Promise<ModelType | undefined> => {
		if (!requestInfo) {
			throw new Error("requestInfo cannot be null");
		}
		const response = await this.getHttpResponseMessage(requestInfo);
		if (responseHandler) {
			return await responseHandler.handleResponseAsync(response, errorMappings);
		} else {
			try {
				await this.throwFailedResponses(response, errorMappings);
				if (this.shouldReturnUndefined(response)) return undefined;
				const rootNode = await this.getRootParseNode(response);
				const result = rootNode.getObjectValue(type);
				return result as unknown as ModelType;
			} finally {
				await this.purgeResponseBody(response);
			}
		}
	};
	public sendPrimitiveAsync = async <ResponseType>(requestInfo: RequestInformation, responseType: "string" | "number" | "boolean" | "Date" | "ArrayBuffer", responseHandler: ResponseHandler | undefined, errorMappings: Record<string, ParsableFactory<Parsable>> | undefined): Promise<ResponseType | undefined> => {
		if (!requestInfo) {
			throw new Error("requestInfo cannot be null");
		}
		const response = await this.getHttpResponseMessage(requestInfo);
		if (responseHandler) {
			return await responseHandler.handleResponseAsync(response, errorMappings);
		} else {
			try {
				await this.throwFailedResponses(response, errorMappings);
				if (this.shouldReturnUndefined(response)) return undefined;
				switch (responseType) {
					case "ArrayBuffer":
						// eslint-disable-next-line no-case-declarations
						if (!response.body) {
							return undefined;
						}
						return (await response.arrayBuffer()) as unknown as ResponseType;
					case "string":
					case "number":
					case "boolean":
					case "Date":
						// eslint-disable-next-line no-case-declarations
						const rootNode = await this.getRootParseNode(response);
						if (responseType === "string") {
							return rootNode.getStringValue() as unknown as ResponseType;
						} else if (responseType === "number") {
							return rootNode.getNumberValue() as unknown as ResponseType;
						} else if (responseType === "boolean") {
							return rootNode.getBooleanValue() as unknown as ResponseType;
						} else if (responseType === "Date") {
							return rootNode.getDateValue() as unknown as ResponseType;
						} else if (responseType === "Duration") {
							return rootNode.getDurationValue() as unknown as ResponseType;
						} else if (responseType === "DateOnly") {
							return rootNode.getDateOnlyValue() as unknown as ResponseType;
						} else if (responseType === "TimeOnly") {
							return rootNode.getTimeOnlyValue() as unknown as ResponseType;
						} else {
							throw new Error("unexpected type to deserialize");
						}
				}
			} finally {
				await this.purgeResponseBody(response);
			}
		}
	};
	public sendNoResponseContentAsync = async (requestInfo: RequestInformation, responseHandler: ResponseHandler | undefined, errorMappings: Record<string, ParsableFactory<Parsable>> | undefined): Promise<void> => {
		if (!requestInfo) {
			throw new Error("requestInfo cannot be null");
		}
		const response = await this.getHttpResponseMessage(requestInfo);
		if (responseHandler) {
			return await responseHandler.handleResponseAsync(response, errorMappings);
		}
		try {
			await this.throwFailedResponses(response, errorMappings);
		} finally {
			await this.purgeResponseBody(response);
		}
	};
	public enableBackingStore = (backingStoreFactory?: BackingStoreFactory | undefined): void => {
		this.parseNodeFactory = enableBackingStoreForParseNodeFactory(this.parseNodeFactory);
		this.serializationWriterFactory = enableBackingStoreForSerializationWriterFactory(this.serializationWriterFactory);
		if (!this.serializationWriterFactory || !this.parseNodeFactory) throw new Error("unable to enable backing store");
		if (backingStoreFactory) {
			BackingStoreFactorySingleton.instance = backingStoreFactory;
		}
	};
	private getRootParseNode = async (response: Response): Promise<ParseNode> => {
		const payload = await response.arrayBuffer();
		const responseContentType = this.getResponseContentType(response);
		if (!responseContentType) throw new Error("no response content type found for deserialization");

		return this.parseNodeFactory.getRootParseNode(responseContentType, payload);
	};
	private shouldReturnUndefined = (response: Response): boolean => {
		return response.status === 204 || !response.body;
	};
	/** purges the response body if it hasn't been read to release the connection to the server */
	private purgeResponseBody = async (response: Response): Promise<void> => {
		if (!response.bodyUsed && response.body) {
			await response.arrayBuffer();
		}
	};
	private throwFailedResponses = async (response: Response, errorMappings: Record<string, ParsableFactory<Parsable>> | undefined): Promise<void> => {
		if (response.ok) return;

		const statusCode = response.status;
		const statusCodeAsString = statusCode.toString();
		if (!errorMappings || (!errorMappings[statusCodeAsString] && !(statusCode >= 400 && statusCode < 500 && errorMappings["4XX"]) && !(statusCode >= 500 && statusCode < 600 && errorMappings["5XX"]))) throw new ApiError("the server returned an unexpected status code and no error class is registered for this code " + statusCode);

		const factory = errorMappings[statusCodeAsString] ?? (statusCode >= 400 && statusCode < 500 ? errorMappings["4XX"] : undefined) ?? (statusCode >= 500 && statusCode < 600 ? errorMappings["5XX"] : undefined);

		const rootNode = await this.getRootParseNode(response);
		const error = rootNode.getObjectValue(factory);

		if (error) throw error;
		else throw new ApiError("unexpected error type" + typeof error);
	};
	private getHttpResponseMessage = async (requestInfo: RequestInformation, claims?: string): Promise<Response> => {
		if (!requestInfo) {
			throw new Error("requestInfo cannot be null");
		}
		this.setBaseUrlForRequestInformation(requestInfo);
		const additionalContext = {} as Record<string, unknown>;
		if (claims) {
			additionalContext["claims"] = claims;
		}
		await this.authenticationProvider.authenticateRequest(requestInfo, additionalContext);

		const request = this.getRequestFromRequestInformation(requestInfo);
		const response = await this.httpClient.executeFetch(requestInfo.URL, request, requestInfo.getRequestOptions());

		return await this.retryCAEResponseIfRequired(requestInfo, response, claims);
	};
	private retryCAEResponseIfRequired = async (requestInfo: RequestInformation, response: Response, claims?: string) => {
		const responseClaims = this.getClaimsFromResponse(response, claims);
		if (responseClaims) {
			await this.purgeResponseBody(response);
			return await this.getHttpResponseMessage(requestInfo, responseClaims);
		}
		return response;
	};
	private getClaimsFromResponse = (response: Response, claims?: string) => {
		if (response.status === 401 && !claims) {
			// avoid infinite loop, we only retry once
			// no need to check for the content since it's an array and it doesn't need to be rewound
			const rawAuthenticateHeader = response.headers.get("WWW-Authenticate");
			if (rawAuthenticateHeader && /^Bearer /gi.test(rawAuthenticateHeader)) {
				const rawParameters = rawAuthenticateHeader.replace(/^Bearer /gi, "").split(",");
				for (const rawParameter of rawParameters) {
					const trimmedParameter = rawParameter.trim();
					if (/claims="[^"]+"/gi.test(trimmedParameter)) {
						return trimmedParameter.replace(/claims="([^"]+)"/gi, "$1");
					}
				}
			}
		}
		return undefined;
	};
	private setBaseUrlForRequestInformation = (requestInfo: RequestInformation): void => {
		requestInfo.pathParameters["baseurl"] = this.baseUrl;
	};
	private getRequestFromRequestInformation = (requestInfo: RequestInformation): RequestInit => {
		const request = {
			method: requestInfo.httpMethod?.toString(),
			headers: requestInfo.headers,
			body: requestInfo.content,
		} as RequestInit;
		return request;
	};
}
