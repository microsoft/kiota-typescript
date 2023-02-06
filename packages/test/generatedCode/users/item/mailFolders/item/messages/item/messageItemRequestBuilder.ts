        import {createMessageFromDiscriminatorValue} from '../../../../../../models/createMessageFromDiscriminatorValue';
        import {deserializeIntoMessage} from '../../../../../../models/deserializeIntoMessage';
        import {Message} from '../../../../../../models/message';
        import {serializeMessage} from '../../../../../../models/serializeMessage';
        import {AttachmentsRequestBuilder} from './attachments/attachmentsRequestBuilder';
        import {AttachmentItemRequestBuilder} from './attachments/item/attachmentItemRequestBuilder';
        import {ExtensionsRequestBuilder} from './extensions/extensionsRequestBuilder';
        import {ExtensionItemRequestBuilder} from './extensions/item/extensionItemRequestBuilder';
        import {MessageItemRequestBuilderDeleteRequestConfiguration} from './messageItemRequestBuilderDeleteRequestConfiguration';
        import {MessageItemRequestBuilderGetRequestConfiguration} from './messageItemRequestBuilderGetRequestConfiguration';
        import {MessageItemRequestBuilderPatchRequestConfiguration} from './messageItemRequestBuilderPatchRequestConfiguration';
        import {MultiValueLegacyExtendedPropertyItemRequestBuilder} from './multiValueExtendedProperties/item/multiValueLegacyExtendedPropertyItemRequestBuilder';
        import {MultiValueExtendedPropertiesRequestBuilder} from './multiValueExtendedProperties/multiValueExtendedPropertiesRequestBuilder';
        import {SingleValueLegacyExtendedPropertyItemRequestBuilder} from './singleValueExtendedProperties/item/singleValueLegacyExtendedPropertyItemRequestBuilder';
        import {SingleValueExtendedPropertiesRequestBuilder} from './singleValueExtendedProperties/singleValueExtendedPropertiesRequestBuilder';
        import {ContentRequestBuilder} from './value/contentRequestBuilder';
        import {getPathParameters, HttpMethod, Parsable, ParsableFactory, RequestAdapter, RequestInformation, RequestOption, ResponseHandler} from '@microsoft/kiota-abstractions';

        /**
         * Builds and executes requests for operations under /users/{user-id}/mailFolders/{mailFolder-id}/messages/{message-id}
         */
        export class MessageItemRequestBuilder {
            /** The attachments property */
            /** The attachments property */
            /** The Content property */
            /** The Content property */
            /** The extensions property */
            /** The extensions property */
            /** The multiValueExtendedProperties property */
            /** The multiValueExtendedProperties property */
            /** Path parameters for the request */
            /** Path parameters for the request */
            public pathParameters: Record<string, unknown>;
            /** The request adapter to use to execute the requests. */
            /** The request adapter to use to execute the requests. */
            public requestAdapter: RequestAdapter;
            /** The singleValueExtendedProperties property */
            /** The singleValueExtendedProperties property */
            /** Url template to use to build the URL for the current request builder */
            /** Url template to use to build the URL for the current request builder */
            private urlTemplate: string;
            /**
             * Instantiates a new MessageItemRequestBuilder and sets the default values.
             * @param pathParameters The raw url or the Url template parameters for the request.
             * @param requestAdapter The request adapter to use to execute the requests.
             */
            public constructor(pathParameters: Record<string, unknown> | string | undefined, requestAdapter: RequestAdapter) {
                if(!pathParameters) throw new Error("pathParameters cannot be undefined");
                if(!requestAdapter) throw new Error("requestAdapter cannot be undefined");
                this.urlTemplate = "{+baseurl}/users/{user%2Did}/mailFolders/{mailFolder%2Did}/messages/{message%2Did}{?%24select,%24expand}";
                const urlTplParams = getPathParameters(pathParameters);
                this.pathParameters = urlTplParams;
                this.requestAdapter = requestAdapter;
            };
            /**
             * Delete navigation property messages for users
             * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
             * @param responseHandler Response handler to use in place of the default response handling provided by the core service
             */
            public delete(requestConfiguration?: MessageItemRequestBuilderDeleteRequestConfiguration | undefined, responseHandler?: ResponseHandler | undefined) : Promise<void> {
                const requestInfo = this.toDeleteRequestInformation(
                    requestConfiguration
                );
                return this.requestAdapter?.sendNoResponseContentAsync(requestInfo, responseHandler, undefined) ?? Promise.reject(new Error('request adapter is null'));
            };
            /**
             * The collection of messages in the mailFolder.
             * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
             * @param responseHandler Response handler to use in place of the default response handling provided by the core service
             * @returns a Promise of Message
             */
            public get(requestConfiguration?: MessageItemRequestBuilderGetRequestConfiguration | undefined, responseHandler?: ResponseHandler | undefined) : Promise<Message | undefined> {
                const requestInfo = this.toGetRequestInformation(
                    requestConfiguration
                );
                return this.requestAdapter?.sendAsync<Message>(requestInfo, createMessageFromDiscriminatorValue, responseHandler, undefined) ?? Promise.reject(new Error('request adapter is null'));
            };
            /**
             * Update the navigation property messages in users
             * @param body The request body
             * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
             * @param responseHandler Response handler to use in place of the default response handling provided by the core service
             */
            public patch(body: Message | undefined, requestConfiguration?: MessageItemRequestBuilderPatchRequestConfiguration | undefined, responseHandler?: ResponseHandler | undefined) : Promise<void> {
                if(!body) throw new Error("body cannot be undefined");
                const requestInfo = this.toPatchRequestInformation(
                    body, requestConfiguration
                );
                return this.requestAdapter?.sendNoResponseContentAsync(requestInfo, responseHandler, undefined) ?? Promise.reject(new Error('request adapter is null'));
            };
            /**
             * Delete navigation property messages for users
             * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
             * @returns a RequestInformation
             */
            public toDeleteRequestInformation(requestConfiguration?: MessageItemRequestBuilderDeleteRequestConfiguration | undefined) : RequestInformation {
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
             * The collection of messages in the mailFolder.
             * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
             * @returns a RequestInformation
             */
            public toGetRequestInformation(requestConfiguration?: MessageItemRequestBuilderGetRequestConfiguration | undefined) : RequestInformation {
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
             * Update the navigation property messages in users
             * @param body The request body
             * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
             * @returns a RequestInformation
             */
            public toPatchRequestInformation(body: Message | undefined, requestConfiguration?: MessageItemRequestBuilderPatchRequestConfiguration | undefined) : RequestInformation {
                if(!body) throw new Error("body cannot be undefined");
                const requestInfo = new RequestInformation();
                requestInfo.urlTemplate = this.urlTemplate;
                requestInfo.pathParameters = this.pathParameters;
                requestInfo.httpMethod = HttpMethod.PATCH;
                if (requestConfiguration) {
                    requestInfo.addRequestHeaders(requestConfiguration.headers);
                    requestInfo.addRequestOptions(requestConfiguration.options);
                }
                requestInfo.setContentFromParsable(this.requestAdapter, "application/json", body as any, serializeMessage);
                return requestInfo;
            };
        }
