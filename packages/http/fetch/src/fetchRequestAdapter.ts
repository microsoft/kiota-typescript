import { ApiError, AuthenticationProvider, BackingStoreFactory, BackingStoreFactorySingleton, DateOnly, Duration, enableBackingStoreForParseNodeFactory, enableBackingStoreForSerializationWriterFactory, Parsable, ParsableFactory, ParseNode, ParseNodeFactory, ParseNodeFactoryRegistry, RequestAdapter, RequestInformation, ResponseHandler, SerializationWriterFactory, SerializationWriterFactoryRegistry, TimeOnly } from "@microsoft/kiota-abstractions";
import { Span, trace } from "@opentelemetry/api";

import { HttpClient } from "./httpClient";
import { ObservabilityOptions, ObservabilityOptionsImpl, ObservabilityOptionsInternal } from "./observabilityOptions";

export class FetchRequestAdapter implements RequestAdapter {
	/** The base url for every request. */
	public baseUrl = "";
	public getSerializationWriterFactory(): SerializationWriterFactory {
		return this.serializationWriterFactory;
	}
	private readonly observabilityOptions: ObservabilityOptions & ObservabilityOptionsInternal;
	/**
	 * Instantiates a new http core service
	 * @param authenticationProvider the authentication provider to use.
	 * @param parseNodeFactory the parse node factory to deserialize responses.
	 * @param serializationWriterFactory the serialization writer factory to use to serialize request bodies.
	 * @param httpClient the http client to use to execute requests.
	 * @param observabilityOptions the observability options to use.
	 */
	public constructor(public readonly authenticationProvider: AuthenticationProvider, private parseNodeFactory: ParseNodeFactory = ParseNodeFactoryRegistry.defaultInstance, private serializationWriterFactory: SerializationWriterFactory = SerializationWriterFactoryRegistry.defaultInstance, private readonly httpClient: HttpClient = new HttpClient(), observabilityOptions: ObservabilityOptions = new ObservabilityOptionsImpl()) {
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
		if (!observabilityOptions) {
			throw new Error("observability options cannot be null");
		} else {
			this.observabilityOptions = new ObservabilityOptionsImpl(observabilityOptions);
		}
	}
	private getResponseContentType = (response: Response): string | undefined => {
		const header = response.headers.get("content-type")?.toLowerCase();
		if (!header) return undefined;
		const segments = header.split(";");
		if (segments.length === 0) return undefined;
		else return segments[0];
	};
	public sendCollectionOfPrimitiveAsync = <ResponseType>(requestInfo: RequestInformation, responseType: "string" | "number" | "boolean" | "Date", responseHandler: ResponseHandler | undefined, errorMappings: Record<string, ParsableFactory<Parsable>> | undefined): Promise<ResponseType[] | undefined> => {
		if (!requestInfo) {
			throw new Error("requestInfo cannot be null");
		}
		return this.startTracingSpan(requestInfo, "sendCollectionOfPrimitiveAsync", async (span) => {
			try {
				const response = await this.getHttpResponseMessage(requestInfo, span);
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
			} finally {
				span.end();
			}
		});
	};
	public sendCollectionAsync = <ModelType extends Parsable>(requestInfo: RequestInformation, type: ParsableFactory<ModelType>, responseHandler: ResponseHandler | undefined, errorMappings: Record<string, ParsableFactory<Parsable>> | undefined): Promise<ModelType[] | undefined> => {
		if (!requestInfo) {
			throw new Error("requestInfo cannot be null");
		}
		return this.startTracingSpan(requestInfo, "sendCollectionAsync", async (span) => {
			try {
				const response = await this.getHttpResponseMessage(requestInfo, span);
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
			} finally {
				span.end();
			}
		});
	};
	private startTracingSpan = <T>(requestInfo: RequestInformation, methodName: string, callback: (arg0: Span) => Promise<T>): Promise<T> => {
		const urlTemplate = decodeURIComponent(requestInfo.urlTemplate ?? "");
		const telemetryPathValue = urlTemplate.replace(/\{\?[^}]+\}/gi, "");
		return trace.getTracer(this.observabilityOptions.getTracerInstrumentationName()).startActiveSpan(`${methodName} - ${telemetryPathValue}`, async (span) => {
			try {
				span.setAttribute("http.uri_template", urlTemplate);
				return await callback(span);
			} finally {
				span.end();
			}
		});
	};
	public sendAsync = <ModelType extends Parsable>(requestInfo: RequestInformation, type: ParsableFactory<ModelType>, responseHandler: ResponseHandler | undefined, errorMappings: Record<string, ParsableFactory<Parsable>> | undefined): Promise<ModelType | undefined> => {
		if (!requestInfo) {
			throw new Error("requestInfo cannot be null");
		}
		return this.startTracingSpan(requestInfo, "sendAsync", async (span) => {
			try {
				const response = await this.getHttpResponseMessage(requestInfo, span);
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
			} finally {
				span.end();
			}
		}) as Promise<ModelType>;
	};
	public sendPrimitiveAsync = <ResponseType>(requestInfo: RequestInformation, responseType: "string" | "number" | "boolean" | "Date" | "ArrayBuffer", responseHandler: ResponseHandler | undefined, errorMappings: Record<string, ParsableFactory<Parsable>> | undefined): Promise<ResponseType | undefined> => {
		if (!requestInfo) {
			throw new Error("requestInfo cannot be null");
		}
		return this.startTracingSpan(requestInfo, "sendPrimitiveAsync", async (span) => {
			try {
				const response = await this.getHttpResponseMessage(requestInfo, span);
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
			} finally {
				span.end();
			}
		}) as Promise<ResponseType>;
	};
	public sendNoResponseContentAsync = (requestInfo: RequestInformation, responseHandler: ResponseHandler | undefined, errorMappings: Record<string, ParsableFactory<Parsable>> | undefined): Promise<void> => {
		if (!requestInfo) {
			throw new Error("requestInfo cannot be null");
		}
		return this.startTracingSpan(requestInfo, "sendNoResponseContentAsync", async (span) => {
			try {
				const response = await this.getHttpResponseMessage(requestInfo, span);
				if (responseHandler) {
					return await responseHandler.handleResponseAsync(response, errorMappings);
				}
				try {
					await this.throwFailedResponses(response, errorMappings);
				} finally {
					await this.purgeResponseBody(response);
				}
			} finally {
				span.end();
			}
		});
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
	private getHttpResponseMessage = (requestInfo: RequestInformation, spanForAttributes: Span, claims?: string): Promise<Response> => {
		return trace.getTracer(this.observabilityOptions.getTracerInstrumentationName()).startActiveSpan("getHttpResponseMessage", async (span) => {
			try {
				if (!requestInfo) {
					throw new Error("requestInfo cannot be null");
				}
				this.setBaseUrlForRequestInformation(requestInfo);
				const additionalContext = {} as Record<string, unknown>;
				if (claims) {
					additionalContext["claims"] = claims;
				}
				await this.authenticationProvider.authenticateRequest(requestInfo, additionalContext);

				const request = await this.getRequestFromRequestInformation(requestInfo, spanForAttributes);
				let response = await this.httpClient.executeFetch(requestInfo.URL, request, requestInfo.getRequestOptions());

				response = await this.retryCAEResponseIfRequired(requestInfo, response, spanForAttributes, claims);
				if (response) {
					const responseContentLength = response.headers.get("Content-Length");
					if (responseContentLength) {
						spanForAttributes.setAttribute("http.response_content_length", parseInt(responseContentLength));
					}
					const responseContentType = response.headers.get("Content-Type");
					if (responseContentType) {
						spanForAttributes.setAttribute("http.response_content_type", responseContentType);
					}
					spanForAttributes.setAttribute("http.status_code", response.status);
					// getting the http.flavor (protocol version) is impossible with fetch API
				}
				return response;
			} finally {
				span.end();
			}
		});
	};
	private retryCAEResponseIfRequired = async (requestInfo: RequestInformation, response: Response, spanForAttributes: Span, claims?: string) => {
		const responseClaims = this.getClaimsFromResponse(response, claims);
		if (responseClaims) {
			await this.purgeResponseBody(response);
			return await this.getHttpResponseMessage(requestInfo, spanForAttributes, responseClaims);
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
	private getRequestFromRequestInformation = (requestInfo: RequestInformation, spanForAttributes: Span): Promise<RequestInit> => {
		return trace.getTracer(this.observabilityOptions.getTracerInstrumentationName()).startActiveSpan("getRequestFromRequestInformation", async (span) => {
			try {
				const method = requestInfo.httpMethod?.toString();
				const uri = requestInfo.URL;
				spanForAttributes.setAttribute("http.method", method ?? "");
				const uriContainsScheme = uri.indexOf("://") > -1;
				const schemeSplatUri = uri.split("://");
				if (uriContainsScheme) {
					spanForAttributes.setAttribute("http.scheme", schemeSplatUri[0]);
				}
				const uriWithoutScheme = uriContainsScheme ? schemeSplatUri[1] : uri;
				spanForAttributes.setAttribute("http.host", uriWithoutScheme.split("/")[0]);
				if (this.observabilityOptions.includeEUIIAttributes) {
					spanForAttributes.setAttribute("http.uri", decodeURIComponent(uri));
				}
				const requestContentLength = requestInfo.headers["Content-Length"];
				if (requestContentLength) {
					spanForAttributes.setAttribute("http.request_content_length", parseInt(requestContentLength));
				}
				const requestContentType = requestInfo.headers["Content-Type"];
				if (requestContentType) {
					spanForAttributes.setAttribute("http.request_content_type", requestContentType);
				}
				const request = {
					method,
					headers: requestInfo.headers,
					body: requestInfo.content,
				} as RequestInit;
				return request;
			} finally {
				span.end();
			}
		});
	};
}
