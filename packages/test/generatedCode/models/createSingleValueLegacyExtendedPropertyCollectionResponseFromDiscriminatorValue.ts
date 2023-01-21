import {deserializeIntoSingleValueLegacyExtendedPropertyCollectionResponse} from './deserializeIntoSingleValueLegacyExtendedPropertyCollectionResponse';
import {SingleValueLegacyExtendedPropertyCollectionResponse} from './singleValueLegacyExtendedPropertyCollectionResponse';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createSingleValueLegacyExtendedPropertyCollectionResponseFromDiscriminatorValue(parseNode: ParseNode | undefined) {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return deserializeIntoSingleValueLegacyExtendedPropertyCollectionResponse;
}
