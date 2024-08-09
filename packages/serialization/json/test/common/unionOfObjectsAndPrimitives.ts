import { type AdditionalDataHolder, type BaseRequestBuilder, type Parsable, type ParsableFactory, type ParseNode, type RequestConfiguration, type RequestInformation, type RequestsMetadata, type SerializationWriter } from "@microsoft/kiota-abstractions";

export interface Cat extends Parsable, Pet {
	/**
	 * The favoriteToy property
	 */
	favoriteToy?: string;
}
/**
 * Creates a new instance of the appropriate class based on discriminator value
 * @param parseNode The parse node to use to read the discriminator value and create the object
 * @returns {Cat}
 */
export function createCatFromDiscriminatorValue(parseNode: ParseNode | undefined): (instance?: Parsable) => Record<string, (node: ParseNode) => void> {
	return deserializeIntoCat;
}
/**
 * Creates a new instance of the appropriate class based on discriminator value
 * @param parseNode The parse node to use to read the discriminator value and create the object
 * @returns {Dog}
 */
export function createDogFromDiscriminatorValue(parseNode: ParseNode | undefined): (instance?: Parsable) => Record<string, (node: ParseNode) => void> {
	return deserializeIntoDog;
}
/**
 * Creates a new instance of the appropriate class based on discriminator value
 * @param parseNode The parse node to use to read the discriminator value and create the object
 * @returns {Pet}
 */
export function createPetFromDiscriminatorValue(parseNode: ParseNode | undefined): (instance?: Parsable) => Record<string, (node: ParseNode) => void> {
	return deserializeIntoPet;
}
/**
 * The deserialization information for the current model
 * @returns {Record<string, (node: ParseNode) => void>}
 */
export function deserializeIntoCat(cat: Partial<Cat> | undefined = {}): Record<string, (node: ParseNode) => void> {
	return {
		...deserializeIntoPet(cat),
		favoriteToy: (n) => {
			cat.favoriteToy = n.getStringValue();
		},
	};
}
/**
 * The deserialization information for the current model
 * @returns {Record<string, (node: ParseNode) => void>}
 */
export function deserializeIntoDog(dog: Partial<Dog> | undefined = {}): Record<string, (node: ParseNode) => void> {
	return {
		...deserializeIntoPet(dog),
		breed: (n) => {
			dog.breed = n.getStringValue();
		},
	};
}
/**
 * The deserialization information for the current model
 * @returns {Record<string, (node: ParseNode) => void>}
 */
export function deserializeIntoPet(pet: Partial<Pet> | undefined = {}): Record<string, (node: ParseNode) => void> {
	return {
		age: (n) => {
			pet.age = n.getNumberValue();
		},
		name: (n) => {
			pet.name = n.getStringValue();
		},
	};
}
export interface Dog extends Parsable, Pet {
	/**
	 * The breed property
	 */
	breed?: string;
}
export interface Pet extends AdditionalDataHolder, Parsable {
	/**
	 * Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
	 */
	additionalData?: Record<string, unknown>;
	/**
	 * The age property
	 */
	age?: number;
	/**
	 * The name property
	 */
	name?: string;
}
/**
 * Serializes information the current object
 * @param writer Serialization writer to use to serialize this model
 */
export function serializeCat(writer: SerializationWriter, cat: Partial<Cat> | undefined = {}): void {
	serializePet(writer, cat);
	writer.writeStringValue("favoriteToy", cat.favoriteToy);
}
/**
 * Serializes information the current object
 * @param writer Serialization writer to use to serialize this model
 */
export function serializeDog(writer: SerializationWriter, dog: Partial<Dog> | undefined = {}): void {
	serializePet(writer, dog);
	writer.writeStringValue("breed", dog.breed);
}
/**
 * Serializes information the current object
 * @param writer Serialization writer to use to serialize this model
 */
export function serializePet(writer: SerializationWriter, pet: Partial<Pet> | undefined = {}): void {
	writer.writeNumberValue("age", pet.age);
	writer.writeStringValue("name", pet.name);
	writer.writeAdditionalData(pet.additionalData);
}
/* tslint:enable */
/* eslint-enable */
/**
 * Creates a new instance of the appropriate class based on discriminator value
 * @param parseNode The parse node to use to read the discriminator value and create the object
 * @returns {Cat | Dog | number | string}
 */
export function createPetGetResponse_dataFromDiscriminatorValue(parseNode: ParseNode | undefined): (instance?: Parsable) => Record<string, (node: ParseNode) => void> {
	return deserializeIntoPetGetResponse_data;
}
/**
 * Creates a new instance of the appropriate class based on discriminator value
 * @param parseNode The parse node to use to read the discriminator value and create the object
 * @returns {PetGetResponse}
 */
export function createPetGetResponseFromDiscriminatorValue(parseNode: ParseNode | undefined): (instance?: Parsable) => Record<string, (node: ParseNode) => void> {
	return deserializeIntoPetGetResponse;
}
/**
 * The deserialization information for the current model
 * @returns {Record<string, (node: ParseNode) => void>}
 */
export function deserializeIntoPetGetResponse(petGetResponse: Partial<PetGetResponse> | undefined = {}): Record<string, (node: ParseNode) => void> {
	return {
		data: (n) => {
			petGetResponse.data = n.getNumberValue() ?? n.getStringValue() ?? n.getObjectValue<Cat | Dog | number | string>(createPetGetResponse_dataFromDiscriminatorValue);
		},
		request_id: (n) => {
			petGetResponse.request_id = n.getStringValue();
		},
	};
}
/**
 * The deserialization information for the current model
 * @returns {Record<string, (node: ParseNode) => void>}
 */
export function deserializeIntoPetGetResponse_data(petGetResponse_data: Partial<Cat | Dog | number | string> | undefined = {}): Record<string, (node: ParseNode) => void> {
	return {
		...deserializeIntoCat(petGetResponse_data as Cat),
		...deserializeIntoDog(petGetResponse_data as Dog),
	};
}
export interface PetGetResponse extends AdditionalDataHolder, Parsable {
	/**
	 * Stores additional data not described in the OpenAPI description found when deserializing. Can be used for serialization as well.
	 */
	additionalData?: Record<string, unknown>;
	/**
	 * The data property
	 */
	data?: Cat | Dog | number | string;
	/**
	 * The request_id property
	 */
	request_id?: string;
}
export type PetGetResponse_data = Cat | Dog | number | string;
/**
 * Builds and executes requests for operations under /pet
 */
export interface PetRequestBuilder extends BaseRequestBuilder<PetRequestBuilder> {
	/**
	 * Get pet information
	 * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
	 * @returns {Promise<PetGetResponse>}
	 */
	get(requestConfiguration?: RequestConfiguration<object> | undefined): Promise<PetGetResponse | undefined>;
	/**
	 * Get pet information
	 * @param requestConfiguration Configuration for the request such as headers, query parameters, and middleware options.
	 * @returns {RequestInformation}
	 */
	toGetRequestInformation(requestConfiguration?: RequestConfiguration<object> | undefined): RequestInformation;
}
/**
 * Serializes information the current object
 * @param writer Serialization writer to use to serialize this model
 */
export function serializePetGetResponse(writer: SerializationWriter, petGetResponse: Partial<PetGetResponse> | undefined = {}): void {
	switch (typeof petGetResponse.data) {
		case "number":
			writer.writeNumberValue("data", petGetResponse.data);
			break;
		case "string":
			writer.writeStringValue("data", petGetResponse.data);
			break;
		default:
			writer.writeObjectValue<Cat | Dog | number | string>("data", petGetResponse.data, serializePetGetResponse_data);
			break;
	}
	writer.writeStringValue("request_id", petGetResponse.request_id);
	writer.writeAdditionalData(petGetResponse.additionalData);
}
/**
 * Serializes information the current object
 * @param writer Serialization writer to use to serialize this model
 */
export function serializePetGetResponse_data(writer: SerializationWriter, petGetResponse_data: Partial<Cat | Dog | number | string> | undefined = {}): void {
	serializeCat(writer, petGetResponse_data as Cat);
	serializeDog(writer, petGetResponse_data as Dog);
}
