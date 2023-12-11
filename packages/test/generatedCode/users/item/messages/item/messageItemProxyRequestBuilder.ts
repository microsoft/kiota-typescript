import type { Parsable, ParsableFactory, RequestConfiguration, RequestInformation, RequestMetadata } from "@microsoft/kiota-abstractions";
import { createODataErrorFromDiscriminatorValue } from "../../../../models/oDataErrors";

export interface MessageItemProxyRequestBuilder {
	/**
     * Delete a message in the specified user's mailbox, or delete a relationship of the message. This API is available in the following national cloud deployments.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns a Promise of ArrayBuffer
     * @see {@link https://learn.microsoft.com/graph/api/message-delete?view=graph-rest-1.0|Find more info here}
     */
	delete(requestConfiguration?: RequestConfiguration<object> | undefined) : Promise<ArrayBuffer | undefined>;
	/**
     * Delete a message in the specified user's mailbox, or delete a relationship of the message. This API is available in the following national cloud deployments.
     * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
     * @returns a RequestInformation
     */
	toDeleteRequestInformation(requestConfiguration?: RequestConfiguration<object> | undefined) : RequestInformation;
}

export const MessageItemProxyRequestBuilderUriTemplate = "{+baseurl}/users/{user%2Did}/messages/{message%2Did}{?includeHiddenMessages,%24select,%24expand}";

export const MessageItemProxyRequestBuilderRequestsMetadata: Record<string, RequestMetadata> = {
	"delete": {
		responseBodyContentType: "application/json",
		errorMappings: {
			"4XX": createODataErrorFromDiscriminatorValue,
			"5XX": createODataErrorFromDiscriminatorValue,
		} as Record<string, ParsableFactory<Parsable>>,
		adapterMethodName: "sendPrimitiveAsync",
		responseBodyFactory: "ArrayBuffer",
	},
};