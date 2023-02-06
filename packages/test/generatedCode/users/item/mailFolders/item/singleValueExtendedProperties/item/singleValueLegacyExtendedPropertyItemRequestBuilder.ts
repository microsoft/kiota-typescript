                import {createSingleValueLegacyExtendedPropertyFromDiscriminatorValue} from '../../../../../../models/createSingleValueLegacyExtendedPropertyFromDiscriminatorValue';
                import {deserializeIntoSingleValueLegacyExtendedProperty} from '../../../../../../models/deserializeIntoSingleValueLegacyExtendedProperty';
                import {serializeSingleValueLegacyExtendedProperty} from '../../../../../../models/serializeSingleValueLegacyExtendedProperty';
                import {SingleValueLegacyExtendedProperty} from '../../../../../../models/singleValueLegacyExtendedProperty';
                import {SingleValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration} from './singleValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration';
                import {SingleValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration} from './singleValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration';
                import {SingleValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration} from './singleValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration';
                import {getPathParameters, HttpMethod, Parsable, ParsableFactory, RequestAdapter, RequestInformation, RequestOption, ResponseHandler} from '@microsoft/kiota-abstractions';

                /**
                 * Builds and executes requests for operations under /users/{user-id}/mailFolders/{mailFolder-id}/singleValueExtendedProperties/{singleValueLegacyExtendedProperty-id}
                 */
                export class SingleValueLegacyExtendedPropertyItemRequestBuilder {
                    /** Path parameters for the request */
                    /** Path parameters for the request */
                    public pathParameters: Record<string, unknown>;
                    /** The request adapter to use to execute the requests. */
                    /** The request adapter to use to execute the requests. */
                    public requestAdapter: RequestAdapter;
                    /** Url template to use to build the URL for the current request builder */
                    /** Url template to use to build the URL for the current request builder */
                    private urlTemplate: string;
                    /**
                     * Instantiates a new SingleValueLegacyExtendedPropertyItemRequestBuilder and sets the default values.
                     * @param pathParameters The raw url or the Url template parameters for the request.
                     * @param requestAdapter The request adapter to use to execute the requests.
                     */
                    public constructor(pathParameters: Record<string, unknown> | string | undefined, requestAdapter: RequestAdapter) {
                        if(!pathParameters) throw new Error("pathParameters cannot be undefined");
                        if(!requestAdapter) throw new Error("requestAdapter cannot be undefined");
                        this.urlTemplate = "{+baseurl}/users/{user%2Did}/mailFolders/{mailFolder%2Did}/singleValueExtendedProperties/{singleValueLegacyExtendedProperty%2Did}{?%24select,%24expand}";
                        const urlTplParams = getPathParameters(pathParameters);
                        this.pathParameters = urlTplParams;
                        this.requestAdapter = requestAdapter;
                    };
                    /**
                     * Delete navigation property singleValueExtendedProperties for users
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @param responseHandler Response handler to use in place of the default response handling provided by the core service
                     */
                    public delete(requestConfiguration?: SingleValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration | undefined, responseHandler?: ResponseHandler | undefined) : Promise<void> {
                        const requestInfo = this.toDeleteRequestInformation(
                            requestConfiguration
                        );
                        return this.requestAdapter?.sendNoResponseContentAsync(requestInfo, responseHandler, undefined) ?? Promise.reject(new Error('request adapter is null'));
                    };
                    /**
                     * The collection of single-value extended properties defined for the mailFolder. Read-only. Nullable.
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @param responseHandler Response handler to use in place of the default response handling provided by the core service
                     * @returns a Promise of SingleValueLegacyExtendedProperty
                     */
                    public get(requestConfiguration?: SingleValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration | undefined, responseHandler?: ResponseHandler | undefined) : Promise<SingleValueLegacyExtendedProperty | undefined> {
                        const requestInfo = this.toGetRequestInformation(
                            requestConfiguration
                        );
                        return this.requestAdapter?.sendAsync<SingleValueLegacyExtendedProperty>(requestInfo, createSingleValueLegacyExtendedPropertyFromDiscriminatorValue, responseHandler, undefined) ?? Promise.reject(new Error('request adapter is null'));
                    };
                    /**
                     * Update the navigation property singleValueExtendedProperties in users
                     * @param body The request body
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @param responseHandler Response handler to use in place of the default response handling provided by the core service
                     */
                    public patch(body: SingleValueLegacyExtendedProperty | undefined, requestConfiguration?: SingleValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration | undefined, responseHandler?: ResponseHandler | undefined) : Promise<void> {
                        if(!body) throw new Error("body cannot be undefined");
                        const requestInfo = this.toPatchRequestInformation(
                            body, requestConfiguration
                        );
                        return this.requestAdapter?.sendNoResponseContentAsync(requestInfo, responseHandler, undefined) ?? Promise.reject(new Error('request adapter is null'));
                    };
                    /**
                     * Delete navigation property singleValueExtendedProperties for users
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @returns a RequestInformation
                     */
                    public toDeleteRequestInformation(requestConfiguration?: SingleValueLegacyExtendedPropertyItemRequestBuilderDeleteRequestConfiguration | undefined) : RequestInformation {
                        const requestInfo = new RequestInformation();
                        requestInfo.urlTemplate = this.urlTemplate;
                        requestInfo.pathParameters = this.pathParameters;
                        requestInfo.httpMethod = HttpMethod.DELETE;
                        if (requestConfiguration) {
                            requestInfo.addRequestHeaders(requestConfiguration.headers);
                            requestInfo.addRequestOptions(requestConfiguration.options);
                        }
                        return requestInfo;
                    };
                    /**
                     * The collection of single-value extended properties defined for the mailFolder. Read-only. Nullable.
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @returns a RequestInformation
                     */
                    public toGetRequestInformation(requestConfiguration?: SingleValueLegacyExtendedPropertyItemRequestBuilderGetRequestConfiguration | undefined) : RequestInformation {
                        const requestInfo = new RequestInformation();
                        requestInfo.urlTemplate = this.urlTemplate;
                        requestInfo.pathParameters = this.pathParameters;
                        requestInfo.httpMethod = HttpMethod.GET;
                        requestInfo.headers["Accept"] = ["application/json"];
                        if (requestConfiguration) {
                            requestInfo.addRequestHeaders(requestConfiguration.headers);
                            requestInfo.setQueryStringParametersFromRawObject(requestConfiguration.queryParameters);
                            requestInfo.addRequestOptions(requestConfiguration.options);
                        }
                        return requestInfo;
                    };
                    /**
                     * Update the navigation property singleValueExtendedProperties in users
                     * @param body The request body
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @returns a RequestInformation
                     */
                    public toPatchRequestInformation(body: SingleValueLegacyExtendedProperty | undefined, requestConfiguration?: SingleValueLegacyExtendedPropertyItemRequestBuilderPatchRequestConfiguration | undefined) : RequestInformation {
                        if(!body) throw new Error("body cannot be undefined");
                        const requestInfo = new RequestInformation();
                        requestInfo.urlTemplate = this.urlTemplate;
                        requestInfo.pathParameters = this.pathParameters;
                        requestInfo.httpMethod = HttpMethod.PATCH;
                        if (requestConfiguration) {
                            requestInfo.addRequestHeaders(requestConfiguration.headers);
                            requestInfo.addRequestOptions(requestConfiguration.options);
                        }
                        requestInfo.setContentFromParsable(this.requestAdapter, "application/json", body as any, serializeSingleValueLegacyExtendedProperty);
                        return requestInfo;
                    };
                }
