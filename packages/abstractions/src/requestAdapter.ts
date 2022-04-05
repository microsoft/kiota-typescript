import { RequestInformation } from "./requestInformation";
import { ResponseHandler } from "./responseHandler";
import { ParsableFactory, Parsable, SerializationWriterFactory } from "./serialization";
import { BackingStoreFactory } from "./store";

/** Service responsible for translating abstract Request Info into concrete native HTTP requests. */
export interface RequestAdapter {
  /**
   * Gets the serialization writer factory currently in use for the HTTP core service.
   * @return the serialization writer factory currently in use for the HTTP core service.
   */
  getSerializationWriterFactory(): SerializationWriterFactory;
  /**
   * Excutes the HTTP request specified by the given RequestInformation and returns the deserialized response model.
   * @param requestInfo the request info to execute.
   * @param responseHandler The response handler to use for the HTTP request instead of the default handler.
   * @param errorMappings the error factories mapping to use in case of a failed request.
   * @param type the class of the response model to deserialize the response into.
   * @typeParam ModelType the type of the response model to deserialize the response into.
   * @return a {@link Promise} with the deserialized response model.
   */
  sendAsync<ModelType extends Parsable>(
    requestInfo: RequestInformation,
    type: ParsableFactory<ModelType>,
    responseHandler: ResponseHandler | undefined,
    errorMappings: Record<string, ParsableFactory<Parsable>> | undefined
  ): Promise<ModelType | undefined>;
  /**
   * Excutes the HTTP request specified by the given RequestInformation and returns the deserialized response model collection.
   * @param requestInfo the request info to execute.
   * @param responseHandler The response handler to use for the HTTP request instead of the default handler.
   * @param errorMappings the error factories mapping to use in case of a failed request.
   * @param type the class of the response model to deserialize the response into.
   * @typeParam ModelType the type of the response model to deserialize the response into.
   * @return a {@link Promise} with the deserialized response model collection.
   */
  sendCollectionAsync<ModelType extends Parsable>(
    requestInfo: RequestInformation,
    type: ParsableFactory<ModelType>,
    responseHandler: ResponseHandler | undefined,
    errorMappings: Record<string, ParsableFactory<Parsable>> | undefined
  ): Promise<ModelType[] | undefined>;
  /**
   * Excutes the HTTP request specified by the given RequestInformation and returns the deserialized response model collection.
   * @param requestInfo the request info to execute.
   * @param responseType the class of the response model to deserialize the response into.
   * @param responseHandler The response handler to use for the HTTP request instead of the default handler.
   * @param errorMappings the error factories mapping to use in case of a failed request.
   * @param type the class of the response model to deserialize the response into.
   * @typeParam ResponseType the type of the response model to deserialize the response into.
   * @return a {@link Promise} with the deserialized response model collection.
   */
  sendCollectionOfPrimitiveAsync<ResponseType>(
    requestInfo: RequestInformation,
    responseType: "string" | "number" | "boolean" | "Date",
    responseHandler: ResponseHandler | undefined,
    errorMappings: Record<string, ParsableFactory<Parsable>> | undefined
  ): Promise<ResponseType[] | undefined>;
  /**
   * Excutes the HTTP request specified by the given RequestInformation and returns the deserialized primitive response model.
   * @param requestInfo the request info to execute.
   * @param responseHandler The response handler to use for the HTTP request instead of the default handler.
   * @param errorMappings the error factories mapping to use in case of a failed request.
   * @param responseType the class of the response model to deserialize the response into.
   * @typeParam ResponseType the type of the response model to deserialize the response into.
   * @return a {@link Promise} with the deserialized primitive response model.
   */
  sendPrimitiveAsync<ResponseType>(
    requestInfo: RequestInformation,
    responseType: "string" | "number" | "boolean" | "Date" | "ArrayBuffer",
    responseHandler: ResponseHandler | undefined,
    errorMappings: Record<string, ParsableFactory<Parsable>> | undefined
  ): Promise<ResponseType | undefined>;
  /**
   * Excutes the HTTP request specified by the given RequestInformation and returns the deserialized primitive response model.
   * @param requestInfo the request info to execute.
   * @param responseHandler The response handler to use for the HTTP request instead of the default handler.
   * @param errorMappings the error factories mapping to use in case of a failed request.
   * @return a {@link Promise} of void.
   */
  sendNoResponseContentAsync(
    requestInfo: RequestInformation,
    responseHandler: ResponseHandler | undefined,
    errorMappings: Record<string, ParsableFactory<Parsable>> | undefined
  ): Promise<void>;
  /**
   * Enables the backing store proxies for the SerializationWriters and ParseNodes in use.
   * @param backingStoreFactory the backing store factory to use.
   */
  enableBackingStore(
    backingStoreFactory?: BackingStoreFactory | undefined
  ): void;
  /** The base url for every request. */
  baseUrl: string;
}
