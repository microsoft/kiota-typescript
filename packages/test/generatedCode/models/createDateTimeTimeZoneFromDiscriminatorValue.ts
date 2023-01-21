import {DateTimeTimeZone} from './dateTimeTimeZone';
import {deserializeIntoDateTimeTimeZone} from './deserializeIntoDateTimeTimeZone';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createDateTimeTimeZoneFromDiscriminatorValue(parseNode: ParseNode | undefined) {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return deserializeIntoDateTimeTimeZone;
}
