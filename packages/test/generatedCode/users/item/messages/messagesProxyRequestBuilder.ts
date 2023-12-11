import type { RequestConfiguration, RequestMetadata, RequestInformation, ParsableFactory, Parsable, NavigationMetadata, KeysToExcludeForNavigationMetadata } from "@microsoft/kiota-abstractions";
import { messagesRequestBuilderGetQueryParametersMapper } from ".";
import type { MessagesRequestBuilderGetQueryParameters } from ".";
import { createMessageCollectionResponseFromDiscriminatorValue, createMessageFromDiscriminatorValue, serializeMessage, type Message, type MessageCollectionResponse } from "../../../models";
import { createODataErrorFromDiscriminatorValue } from "../../../models/oDataErrors";
import type { MessageItemProxyRequestBuilder} from "./item/messageItemProxyRequestBuilder";
import { MessageItemProxyRequestBuilderRequestsMetadata, MessageItemProxyRequestBuilderUriTemplate } from "./item/messageItemProxyRequestBuilder";

export interface MessagesProxyRequestBuilder {
	/**
     * The messages in a mailbox or folder. Read-only. Nullable.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns a Promise of MessageCollectionResponse
     * @see {@link https://learn.microsoft.com/graph/api/opentypeextension-get?view=graph-rest-1.0|Find more info here}
     */
    get(requestConfiguration?: RequestConfiguration<MessagesRequestBuilderGetQueryParameters> | undefined): Promise<MessageCollectionResponse | undefined>;
	/**
     * Create an open extension (openTypeExtension object) and add custom properties in a new or existing instance of a resource. You can create an open extension in a resource instance and store custom data to it all in the same operation, except for specific resources. The table in the Permissions section lists the resources that support open extensions. This API is available in the following national cloud deployments.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns a Promise of Message
     * @see {@link https://learn.microsoft.com/graph/api/opentypeextension-post-opentypeextension?view=graph-rest-1.0|Find more info here}
     */
    post(body: Message, requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<Message | undefined>;
	/**
     * The messages in a mailbox or folder. Read-only. Nullable.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns a RequestInformation
     */
    toGetRequestInformation(requestConfiguration?: RequestConfiguration<MessagesRequestBuilderGetQueryParameters> | undefined) : RequestInformation;
	/**
     * Create an open extension (openTypeExtension object) and add custom properties in a new or existing instance of a resource. You can create an open extension in a resource instance and store custom data to it all in the same operation, except for specific resources. The table in the Permissions section lists the resources that support open extensions. This API is available in the following national cloud deployments.
     * @param body The request body
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns a RequestInformation
     */
    toPostRequestInformation(body: Message, requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;

    /**
     * Gets an item from the ApiSdk.users.item.messages.item collection
     * @param messageId The unique identifier of message
     * @returns a MessageItemRequestBuilder
     */
    byMessageId(messageId: string) : MessageItemProxyRequestBuilder;

	//TODO navigation properties (count)
	//TODO navigation methods
}
export const MessagesProxyRequestBuilderUriTemplate = "{+baseurl}/users/{user%2Did}/messages{?includeHiddenMessages,%24top,%24skip,%24search,%24filter,%24count,%24orderby,%24select,%24expand}";
export const MessagesProxyRequestBuilderRequestsMetadata: Record<string, RequestMetadata> = {
	"get": {
		responseBodyContentType: "application/json",
		errorMappings: {
            "4XX": createODataErrorFromDiscriminatorValue,
            "5XX": createODataErrorFromDiscriminatorValue,
        } as Record<string, ParsableFactory<Parsable>>,
		adapterMethodName: "sendAsync",
		responseBodyFactory: createMessageCollectionResponseFromDiscriminatorValue,
		queryParametersMapper: messagesRequestBuilderGetQueryParametersMapper,
	},
	"post": {
		responseBodyContentType: "application/json",
		errorMappings: {
			"4XX": createODataErrorFromDiscriminatorValue,
			"5XX": createODataErrorFromDiscriminatorValue,
		} as Record<string, ParsableFactory<Parsable>>,
		adapterMethodName: "sendAsync",
		responseBodyFactory: createMessageFromDiscriminatorValue,
		requestBodySerializer: serializeMessage,
		requestBodyContentType: "application/json",
	},
};

export const MessagesProxyRequestBuilderNavigationMetadata: Record<Exclude<keyof MessageItemProxyRequestBuilder, KeysToExcludeForNavigationMetadata>, NavigationMetadata> = {
    "byMessageId": {
        uriTemplate: MessageItemProxyRequestBuilderUriTemplate,
        requestsMetadata: MessageItemProxyRequestBuilderRequestsMetadata,
        pathParametersMappings: ["message%2Did"],
    },
};