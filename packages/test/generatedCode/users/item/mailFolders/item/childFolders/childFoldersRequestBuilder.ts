                import {createMailFolderCollectionResponseFromDiscriminatorValue} from '../../../../../models/createMailFolderCollectionResponseFromDiscriminatorValue';
                import {createMailFolderFromDiscriminatorValue} from '../../../../../models/createMailFolderFromDiscriminatorValue';
                import {deserializeIntoMailFolder} from '../../../../../models/deserializeIntoMailFolder';
                import {deserializeIntoMailFolderCollectionResponse} from '../../../../../models/deserializeIntoMailFolderCollectionResponse';
                import {MailFolder} from '../../../../../models/mailFolder';
                import {MailFolderCollectionResponse} from '../../../../../models/mailFolderCollectionResponse';
                import {serializeMailFolder} from '../../../../../models/serializeMailFolder';
                import {serializeMailFolderCollectionResponse} from '../../../../../models/serializeMailFolderCollectionResponse';
                import {ChildFoldersRequestBuilderGetRequestConfiguration} from './childFoldersRequestBuilderGetRequestConfiguration';
                import {ChildFoldersRequestBuilderPostRequestConfiguration} from './childFoldersRequestBuilderPostRequestConfiguration';
                import {getPathParameters, HttpMethod, Parsable, ParsableFactory, RequestAdapter, RequestInformation, RequestOption, ResponseHandler} from '@microsoft/kiota-abstractions';

                /**
                 * Builds and executes requests for operations under /users/{user-id}/mailFolders/{mailFolder-id}/childFolders
                 */
                export class ChildFoldersRequestBuilder {
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
                     * Instantiates a new ChildFoldersRequestBuilder and sets the default values.
                     * @param pathParameters The raw url or the Url template parameters for the request.
                     * @param requestAdapter The request adapter to use to execute the requests.
                     */
                    public constructor(pathParameters: Record<string, unknown> | string | undefined, requestAdapter: RequestAdapter) {
                        if(!pathParameters) throw new Error("pathParameters cannot be undefined");
                        if(!requestAdapter) throw new Error("requestAdapter cannot be undefined");
                        this.urlTemplate = "{+baseurl}/users/{user%2Did}/mailFolders/{mailFolder%2Did}/childFolders{?%24top,%24skip,%24filter,%24count,%24orderby,%24select,%24expand}";
                        const urlTplParams = getPathParameters(pathParameters);
                        this.pathParameters = urlTplParams;
                        this.requestAdapter = requestAdapter;
                    };
                    /**
                     * Get the folder collection under the specified folder. You can use the `.../me/mailFolders` shortcut to get the top-level folder collection and navigate to another folder. By default, this operation does not return hidden folders. Use a query parameter _includeHiddenFolders_ to include them in the response.
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @param responseHandler Response handler to use in place of the default response handling provided by the core service
                     * @returns a Promise of MailFolderCollectionResponse
                     * @see {@link https://docs.microsoft.com/graph/api/mailfolder-list-childfolders?view=graph-rest-1.0|Find more info here}
                     */
                    public get(requestConfiguration?: ChildFoldersRequestBuilderGetRequestConfiguration | undefined, responseHandler?: ResponseHandler | undefined) : Promise<MailFolderCollectionResponse | undefined> {
                        const requestInfo = this.toGetRequestInformation(
                            requestConfiguration
                        );
                        return this.requestAdapter?.sendAsync<MailFolderCollectionResponse>(requestInfo, createMailFolderCollectionResponseFromDiscriminatorValue, responseHandler, undefined) ?? Promise.reject(new Error('request adapter is null'));
                    };
                    /**
                     * Use this API to create a new child mailFolder. If you intend a new folder to be hidden, you must set the **isHidden** property to `true` on creation.
                     * @param body The request body
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @param responseHandler Response handler to use in place of the default response handling provided by the core service
                     * @returns a Promise of MailFolder
                     * @see {@link https://docs.microsoft.com/graph/api/mailfolder-post-childfolders?view=graph-rest-1.0|Find more info here}
                     */
                    public post(body: MailFolder | undefined, requestConfiguration?: ChildFoldersRequestBuilderPostRequestConfiguration | undefined, responseHandler?: ResponseHandler | undefined) : Promise<MailFolder | undefined> {
                        if(!body) throw new Error("body cannot be undefined");
                        const requestInfo = this.toPostRequestInformation(
                            body, requestConfiguration
                        );
                        return this.requestAdapter?.sendAsync<MailFolder>(requestInfo, createMailFolderFromDiscriminatorValue, responseHandler, undefined) ?? Promise.reject(new Error('request adapter is null'));
                    };
                    /**
                     * Get the folder collection under the specified folder. You can use the `.../me/mailFolders` shortcut to get the top-level folder collection and navigate to another folder. By default, this operation does not return hidden folders. Use a query parameter _includeHiddenFolders_ to include them in the response.
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @returns a RequestInformation
                     */
                    public toGetRequestInformation(requestConfiguration?: ChildFoldersRequestBuilderGetRequestConfiguration | undefined) : RequestInformation {
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
                     * Use this API to create a new child mailFolder. If you intend a new folder to be hidden, you must set the **isHidden** property to `true` on creation.
                     * @param body The request body
                     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
                     * @returns a RequestInformation
                     */
                    public toPostRequestInformation(body: MailFolder | undefined, requestConfiguration?: ChildFoldersRequestBuilderPostRequestConfiguration | undefined) : RequestInformation {
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
                        requestInfo.setContentFromParsable(this.requestAdapter, "application/json", body as any, serializeMailFolder);
                        return requestInfo;
                    };
                }
