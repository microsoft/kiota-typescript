                import {createSingleValueLegacyExtendedPropertyCollectionResponseFromDiscriminatorValue} from '../../../../../models/createSingleValueLegacyExtendedPropertyCollectionResponseFromDiscriminatorValue';
                import {createSingleValueLegacyExtendedPropertyFromDiscriminatorValue} from '../../../../../models/createSingleValueLegacyExtendedPropertyFromDiscriminatorValue';
                import {deserializeIntoSingleValueLegacyExtendedProperty} from '../../../../../models/deserializeIntoSingleValueLegacyExtendedProperty';
                import {deserializeIntoSingleValueLegacyExtendedPropertyCollectionResponse} from '../../../../../models/deserializeIntoSingleValueLegacyExtendedPropertyCollectionResponse';
                import {serializeSingleValueLegacyExtendedProperty} from '../../../../../models/serializeSingleValueLegacyExtendedProperty';
                import {serializeSingleValueLegacyExtendedPropertyCollectionResponse} from '../../../../../models/serializeSingleValueLegacyExtendedPropertyCollectionResponse';
                import {SingleValueLegacyExtendedProperty} from '../../../../../models/singleValueLegacyExtendedProperty';
                import {SingleValueLegacyExtendedPropertyCollectionResponse} from '../../../../../models/singleValueLegacyExtendedPropertyCollectionResponse';
                import {SingleValueExtendedPropertiesRequestBuilderGetRequestConfiguration} from './singleValueExtendedPropertiesRequestBuilderGetRequestConfiguration';
                import {SingleValueExtendedPropertiesRequestBuilderPostRequestConfiguration} from './singleValueExtendedPropertiesRequestBuilderPostRequestConfiguration';
                import {getPathParameters, HttpMethod, Parsable, ParsableFactory, RequestAdapter, RequestInformation, RequestOption, ResponseHandler} from '@microsoft/kiota-abstractions';

                /**
                 * Builds and executes requests for operations under /users/{user-id}/mailFolders/{mailFolder-id}/singleValueExtendedProperties
                 */
                export class SingleValueExtendedPropertiesRequestBuilder {
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
                     * Instantiates a new SingleValueExtendedPropertiesRequestBuilder and sets the default values.
                     * @param pathParameters The raw url or the Url template parameters for the request.
                     * @param requestAdapter The request adapter to use to execute the requests.
                     */
                    public constructor(pathParameters: Record<string, unknown> | string | undefined, requestAdapter: RequestAdapter) {
                        if(!pathParameters) throw new Error("pathParameters cannot be undefined");
                        if(!requestAdapter) throw new Error("requestAdapter cannot be undefined");
                        this.urlTemplate = "{+baseurl}/users/{user%2Did}/mailFolders/{mailFolder%2Did}/singleValueExtendedProperties{?%24top,%24skip,%24search,%24filter,%24count,%24orderby,%24select,%24expand}";
                        const urlTplParams = getPathParameters(pathParameters);
                        this.pathParameters = urlTplParams;
                        this.requestAdapter = requestAdapter;
                    };
                    /**
                     * The collection of single-value extended properties defined for the mailFolder. Read-only. Nullable.
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @param responseHandler Response handler to use in place of the default response handling provided by the core service
                     * @returns a Promise of SingleValueLegacyExtendedPropertyCollectionResponse
                     */
                    public get(requestConfiguration?: SingleValueExtendedPropertiesRequestBuilderGetRequestConfiguration | undefined, responseHandler?: ResponseHandler | undefined) : Promise<SingleValueLegacyExtendedPropertyCollectionResponse | undefined> {
                        const requestInfo = this.toGetRequestInformation(
                            requestConfiguration
                        );
                        return this.requestAdapter?.sendAsync<SingleValueLegacyExtendedPropertyCollectionResponse>(requestInfo, createSingleValueLegacyExtendedPropertyCollectionResponseFromDiscriminatorValue, responseHandler, undefined) ?? Promise.reject(new Error('request adapter is null'));
                    };
                    /**
                     * Create new navigation property to singleValueExtendedProperties for users
                     * @param body The request body
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @param responseHandler Response handler to use in place of the default response handling provided by the core service
                     * @returns a Promise of SingleValueLegacyExtendedProperty
                     */
                    public post(body: SingleValueLegacyExtendedProperty | undefined, requestConfiguration?: SingleValueExtendedPropertiesRequestBuilderPostRequestConfiguration | undefined, responseHandler?: ResponseHandler | undefined) : Promise<SingleValueLegacyExtendedProperty | undefined> {
                        if(!body) throw new Error("body cannot be undefined");
                        const requestInfo = this.toPostRequestInformation(
                            body, requestConfiguration
                        );
                        return this.requestAdapter?.sendAsync<SingleValueLegacyExtendedProperty>(requestInfo, createSingleValueLegacyExtendedPropertyFromDiscriminatorValue, responseHandler, undefined) ?? Promise.reject(new Error('request adapter is null'));
                    };
                    /**
                     * The collection of single-value extended properties defined for the mailFolder. Read-only. Nullable.
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @returns a RequestInformation
                     */
                    public toGetRequestInformation(requestConfiguration?: SingleValueExtendedPropertiesRequestBuilderGetRequestConfiguration | undefined) : RequestInformation {
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
                     * Create new navigation property to singleValueExtendedProperties for users
                     * @param body The request body
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @returns a RequestInformation
                     */
                    public toPostRequestInformation(body: SingleValueLegacyExtendedProperty | undefined, requestConfiguration?: SingleValueExtendedPropertiesRequestBuilderPostRequestConfiguration | undefined) : RequestInformation {
                        if(!body) throw new Error("body cannot be undefined");
                        const requestInfo = new RequestInformation();
                        requestInfo.urlTemplate = this.urlTemplate;
                        requestInfo.pathParameters = this.pathParameters;
                        requestInfo.httpMethod = HttpMethod.POST;
                        requestInfo.headers["Accept"] = ["application/json"];
                        if (requestConfiguration) {
                            requestInfo.addRequestHeaders(requestConfiguration.headers);
                            requestInfo.addRequestOptions(requestConfiguration.options);
                        }
                        requestInfo.setContentFromParsable(this.requestAdapter, "application/json", body as any, serializeSingleValueLegacyExtendedProperty);
                        return requestInfo;
                    };
                }
