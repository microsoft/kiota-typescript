/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { assert, describe, it } from "vitest";

import { DateOnly, HttpMethod, type Guid, type Parsable, parseGuidString, type RequestAdapter, RequestInformation, type SerializationWriter, type SerializationWriterFactory, TimeOnly, Duration } from "../../src";
import { MultipartBody } from "../../src/multipartBody";
import { TestEnum } from "./store/testEnum";

interface GetQueryParameters {
	select?: string[];
	count?: boolean;
	filter?: string;
	orderby?: string[];
	search?: string;
	dataset?: TestEnum;
	datasets?: TestEnum[];
	objectId?: Guid;
	startDate?: DateOnly;
	startTime?: TimeOnly;
	endTime?: TimeOnly;
	endDate?: DateOnly;
	timeStamp?: Date;
  time?: TimeOnly;
  duration?: Duration;
}

const getQueryParameterMapper: Record<string, string> = {
	select: "%24select",
	count: "%24count",
	filter: "%24filter",
	orderby: "%24orderby",
	search: "%24search",
};

describe("RequestInformation", () => {
	const baseUrl = "https://graph.microsoft.com/v1.0";
	it("Should set request information uri", () => {
		const requestInformation = new RequestInformation();
		requestInformation.pathParameters["baseurl"] = baseUrl;
		requestInformation.urlTemplate = "{+baseurl}/users";
		assert.isNotNull(URL);
		assert.equal(requestInformation.URL, "https://graph.microsoft.com/v1.0/users");
	});

	it("Should conserve parameters casing", () => {
		const requestInformation = new RequestInformation();
		requestInformation.pathParameters["BaseUrl"] = baseUrl;
		requestInformation.urlTemplate = "{+BaseUrl}/users";
		assert.isNotNull(URL);
		assert.equal(requestInformation.URL, "https://graph.microsoft.com/v1.0/users");
	});

	it("Sets select query parameter", () => {
		const requestInformation = new RequestInformation();
		requestInformation.pathParameters["baseurl"] = baseUrl;
		requestInformation.urlTemplate = "http://localhost/me{?%24select}";
		requestInformation.setQueryStringParametersFromRawObject<GetQueryParameters>({ select: ["id", "displayName"] }, getQueryParameterMapper);
		assert.equal(requestInformation.URL, "http://localhost/me?%24select=id,displayName");
	});

	it("Does not set empty select query parameter", () => {
		const requestInformation = new RequestInformation();
		requestInformation.pathParameters["baseurl"] = baseUrl;
		requestInformation.urlTemplate = "http://localhost/me{?%24select}";
		requestInformation.setQueryStringParametersFromRawObject<GetQueryParameters>({ select: [] }, getQueryParameterMapper);
		assert.equal(requestInformation.URL, "http://localhost/me");
	});

	it("Allows empty search query parameter", () => {
		const requestInformation = new RequestInformation();
		requestInformation.pathParameters["baseurl"] = baseUrl;
		requestInformation.urlTemplate = "http://localhost/me{?%24search}";
		requestInformation.setQueryStringParametersFromRawObject<GetQueryParameters>({ search: "" }, getQueryParameterMapper);
		assert.equal(requestInformation.URL, "http://localhost/me?%24search=");
	});

	it("Sets enum value in query parameters", () => {
		const requestInformation = new RequestInformation();
		requestInformation.pathParameters["baseurl"] = baseUrl;
		requestInformation.urlTemplate = "http://localhost/me{?dataset}";
		requestInformation.setQueryStringParametersFromRawObject<GetQueryParameters>({ dataset: TestEnum.first });
		assert.equal(requestInformation.URL, "http://localhost/me?dataset=1");
	});

	it("Sets enum values in query parameters", () => {
		const requestInformation = new RequestInformation();
		requestInformation.pathParameters["baseurl"] = baseUrl;
		requestInformation.urlTemplate = "http://localhost/me{?datasets}";
		requestInformation.setQueryStringParametersFromRawObject<GetQueryParameters>({
			datasets: [TestEnum.first, TestEnum.second],
		});
		assert.equal(requestInformation.URL, "http://localhost/me?datasets=1,2");
	});

	it.each([
		{ someNumber: -1, expected: "http://localhost/-1" },
		{ someNumber: 0, expected: "http://localhost/0" },
		{ someNumber: 1, expected: "http://localhost/1" },
		{ someNumber: NaN, expected: "http://localhost/NaN" },
	])("Sets number $someNumber in path parameters", () => {
		const requestInformation = new RequestInformation();
		requestInformation.pathParameters["baseurl"] = baseUrl;
		requestInformation.pathParameters["someNumber"] = 0;
		requestInformation.urlTemplate = "http://localhost/{someNumber}";
		assert.equal(requestInformation.URL, "http://localhost/0");
	});

	it.each([
		{ someBoolean: true, expected: "http://localhost/true" },
		{ someBoolean: false, expected: "http://localhost/false" },
	])("Sets false in path parameters", () => {
		const requestInformation = new RequestInformation();
		requestInformation.pathParameters["baseurl"] = baseUrl;
		requestInformation.pathParameters["someBoolean"] = false;
		requestInformation.urlTemplate = "http://localhost/{someBoolean}";
		assert.equal(requestInformation.URL, "http://localhost/false");
	});

	it("Sets enum value in path parameters", () => {
		const requestInformation = new RequestInformation();
		requestInformation.pathParameters["baseurl"] = baseUrl;
		requestInformation.pathParameters["dataset"] = TestEnum.first;
		requestInformation.urlTemplate = "http://localhost/{dataset}";
		assert.equal(requestInformation.URL, "http://localhost/1");
	});

	it("Sets enum values in path parameters", () => {
		const requestInformation = new RequestInformation();
		requestInformation.pathParameters["baseurl"] = baseUrl;
		requestInformation.pathParameters["dataset"] = [TestEnum.first, TestEnum.second];
		requestInformation.urlTemplate = "http://localhost/{dataset}";
		assert.equal(requestInformation.URL, "http://localhost/1,2");
	});

	it("Adds headers to requestInformation", () => {
		const requestInformation = new RequestInformation();
		requestInformation.pathParameters["baseurl"] = baseUrl;
		requestInformation.urlTemplate = "http://localhost/me{?%24select}";
		requestInformation.addRequestHeaders({ ConsistencyLevel: "eventual" });
		assert.isTrue(requestInformation.headers.has("ConsistencyLevel"));
		assert.equal(requestInformation.headers.tryGetValue("ConsistencyLevel")![0], "eventual");
	});

	it("Try to add headers to requestInformation", () => {
		const requestInformation = new RequestInformation();
		requestInformation.pathParameters["baseurl"] = baseUrl;
		requestInformation.urlTemplate = "http://localhost/me{?%24select}";
		assert.isTrue(requestInformation.headers.tryAdd("key", "value1"));
		assert.equal(Array.from(requestInformation.headers.keys()).length, 1);
		assert.equal(requestInformation.headers.tryGetValue("key")!.length, 1);
		assert.equal(requestInformation.headers.tryGetValue("key")![0], "value1");
		assert.isTrue(requestInformation.headers.add("key", "value2"));
		assert.equal(Array.from(requestInformation.headers.keys()).length, 1);
		assert.equal(requestInformation.headers.tryGetValue("key")!.length, 2);
		assert.equal(requestInformation.headers.tryGetValue("key")![0], "value1");
		assert.equal(requestInformation.headers.tryGetValue("key")![1], "value2");
	});

	it("Sets a parsable content", () => {
		const requestInformation = new RequestInformation();
		let methodCalledCount = 0;
		const mockRequestAdapter = {
			getSerializationWriterFactory: () => {
				return {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					getSerializationWriter: (_: string) => {
						return {
							writeObjectValue: <T extends Parsable>(
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								key?: string | undefined,
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								value?: T | undefined,
							) => {
								methodCalledCount++;
							},
							getSerializedContent: () => {
								return new ArrayBuffer(0);
							},
						} as unknown as SerializationWriter;
					},
				} as SerializationWriterFactory;
			},
		} as RequestAdapter;
		requestInformation.setContentFromParsable(mockRequestAdapter, "application/json", {} as unknown as Parsable);
		requestInformation.addRequestHeaders({ ConsistencyLevel: "eventual" });
		//assert.isNotEmpty(requestInformation.headers.entries());
		assert.equal(methodCalledCount, 1);
	});

	it("Sets a parsable collection content", () => {
		const requestInformation = new RequestInformation();
		let methodCalledCount = 0;
		const mockRequestAdapter = {
			getSerializationWriterFactory: () => {
				return {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					getSerializationWriter: (_: string) => {
						return {
							writeCollectionOfObjectValues: <T extends Parsable>(
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								key?: string | undefined,
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								values?: T[],
							) => {
								methodCalledCount++;
							},
							getSerializedContent: () => {
								return new ArrayBuffer(0);
							},
						} as unknown as SerializationWriter;
					},
				} as SerializationWriterFactory;
			},
		} as RequestAdapter;
		requestInformation.setContentFromParsable(mockRequestAdapter, "application/json", [{} as unknown as Parsable]);
		requestInformation.addRequestHeaders({ ConsistencyLevel: "eventual" });
		assert.equal(methodCalledCount, 1);
	});

	it("should correctly handle custom type in query/path parameter", () => {
		const expected: string = `http://localhost/users/33933a8d-32bb-c6a8-784a-f60b5a1dd66a/2021-12-12?objectId=83afbf49-5583-152c-d7fb-176105d518bc&startDate=2021-12-12&startTime=23%3A12%3A00.0000000&timeStamp=2024-06-11T00%3A00%3A00.000Z&duration=P1D`;
		const requestInformation = new RequestInformation(HttpMethod.GET);
		requestInformation.pathParameters["baseurl"] = baseUrl;
		requestInformation.pathParameters["userId"] = parseGuidString("33933a8d-32bb-c6a8-784a-f60b5a1dd66a");
		requestInformation.pathParameters["date"] = DateOnly.parse("2021-12-12");
		requestInformation.urlTemplate = "http://localhost/users/{userId}/{date}{?objectId,startDate,startTime,endDate,endTime,timeStamp,duration}";
		requestInformation.setQueryStringParametersFromRawObject<GetQueryParameters>({ objectId: parseGuidString("83afbf49-5583-152c-d7fb-176105d518bc"), startDate: new DateOnly({ year: 2021, month: 12, day: 12 }), startTime: new TimeOnly({ hours: 23, minutes: 12 }), timeStamp: new Date("2024-06-11T00:00:00.000Z"), duration: Duration.parse("P1D") }, getQueryParameterMapper);
		assert.equal(requestInformation.URL, expected);
	});

	it("Sets a scalar content", () => {
		const requestInformation = new RequestInformation();
		let writtenValue = "";
		const mockRequestAdapter = {
			getSerializationWriterFactory: () => {
				return {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					getSerializationWriter: (_: string) => {
						return {
							writeStringValue: (key?: string | undefined, value?: string | undefined) => {
								writtenValue = value as unknown as string;
							},
							getSerializedContent: () => {
								return new ArrayBuffer(0);
							},
						} as unknown as SerializationWriter;
					},
				} as SerializationWriterFactory;
			},
		} as RequestAdapter;
		requestInformation.setContentFromScalar(mockRequestAdapter, "application/json", "some content");
		requestInformation.addRequestHeaders({ ConsistencyLevel: "eventual" });
		assert.equal(writtenValue, "some content");
	});

	it("Sets a scalar collection content", () => {
		const requestInformation = new RequestInformation();
		let writtenValue = "";
		const mockRequestAdapter = {
			getSerializationWriterFactory: () => {
				return {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					getSerializationWriter: (_: string) => {
						return {
							writeCollectionOfPrimitiveValues: <T>(key?: string | undefined, values?: T[] | undefined) => {
								writtenValue = JSON.stringify(values);
							},
							getSerializedContent: () => {
								return new ArrayBuffer(0);
							},
						} as unknown as SerializationWriter;
					},
				} as SerializationWriterFactory;
			},
		} as RequestAdapter;
		requestInformation.setContentFromScalar(mockRequestAdapter, "application/json", ["some content"]);
		requestInformation.addRequestHeaders({ ConsistencyLevel: "eventual" });
		assert.equal(writtenValue, '["some content"]');
	});

	it("Sets the boundary on multipart content", () => {
		const requestInformation = new RequestInformation();
		requestInformation.urlTemplate = "http://localhost/{URITemplate}/ParameterMapping?IsCaseSensitive={IsCaseSensitive}";
		requestInformation.httpMethod = HttpMethod.POST;
		const mpBody = new MultipartBody();
		const mockRequestAdapter = {
			getSerializationWriterFactory: () => {
				return {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					getSerializationWriter: (_: string) => {
						return {
							writeObjectValue: <T>(key?: string | undefined, value?: T | undefined) => {
								if (key === "value") {
									mpBody.addOrReplacePart("1", "application/json", value);
								}
							},
							getSerializedContent: () => {
								return new ArrayBuffer(0);
							},
						} as unknown as SerializationWriter;
					},
				} as SerializationWriterFactory;
			},
		} as RequestAdapter;
		requestInformation.setContentFromParsable(mockRequestAdapter, "multipart/form-data", mpBody);
		const contentTypeHeaderValue = requestInformation.headers.tryGetValue("Content-Type")![0];
		assert.equal(contentTypeHeaderValue, `multipart/form-data; boundary=${mpBody.getBoundary()}`);
		assert.isNotEmpty(mpBody.getBoundary());
	});
});
