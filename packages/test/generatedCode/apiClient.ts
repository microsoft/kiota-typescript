                import {UserItemRequestBuilder} from './users/item/userItemRequestBuilder';
                import {UsersRequestBuilder} from './users/usersRequestBuilder';
                import {enableBackingStoreForSerializationWriterFactory, getPathParameters, ParseNodeFactoryRegistry, registerDefaultDeserializer, registerDefaultSerializer, RequestAdapter, SerializationWriterFactoryRegistry} from '@microsoft/kiota-abstractions';
                import {FormParseNodeFactory, FormSerializationWriterFactory} from '@microsoft/kiota-serialization-form';
                import {JsonParseNodeFactory, JsonSerializationWriterFactory} from '@microsoft/kiota-serialization-json';
                import {TextParseNodeFactory, TextSerializationWriterFactory} from '@microsoft/kiota-serialization-text';

                /**
                 * The main entry point of the SDK, exposes the configuration and the fluent API.
                 */
                export class ApiClient {
                    /** Path parameters for the request */
                    /** Path parameters for the request */
                    public pathParameters: Record<string, unknown>;
                    /** The request adapter to use to execute the requests. */
                    /** The request adapter to use to execute the requests. */
                    public requestAdapter: RequestAdapter;
                    /** Url template to use to build the URL for the current request builder */
                    /** Url template to use to build the URL for the current request builder */
                    private urlTemplate: string;
                    /** The users property */
                    /** The users property */
                    /**
                     * Instantiates a new ApiClient and sets the default values.
                     * @param requestAdapter The request adapter to use to execute the requests.
                     */
                    public constructor(requestAdapter: RequestAdapter) {
                        if(!requestAdapter) throw new Error("requestAdapter cannot be undefined");
                        this.pathParameters = {};
                        this.urlTemplate = "{+baseurl}";
                        this.requestAdapter = requestAdapter;
                        registerDefaultSerializer(JsonSerializationWriterFactory);
                        registerDefaultSerializer(TextSerializationWriterFactory);
                        registerDefaultSerializer(FormSerializationWriterFactory);
                        registerDefaultDeserializer(JsonParseNodeFactory);
                        registerDefaultDeserializer(TextParseNodeFactory);
                        registerDefaultDeserializer(FormParseNodeFactory);
                        if (requestAdapter.baseUrl === undefined || requestAdapter.baseUrl === "") {
                            requestAdapter.baseUrl = "https://graph.microsoft.com/v1.0";
                        }
                        this.pathParameters["baseurl"] = requestAdapter.baseUrl;
                    };
                }
