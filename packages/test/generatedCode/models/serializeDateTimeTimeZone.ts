import {DateTimeTimeZone} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeDateTimeTimeZone(writer: SerializationWriter, dateTimeTimeZone: DateTimeTimeZone | undefined = {}) : void {
            writer.writeStringValue("dateTime", dateTimeTimeZone.dateTime);
            writer.writeStringValue("timeZone", dateTimeTimeZone.timeZone);
}
