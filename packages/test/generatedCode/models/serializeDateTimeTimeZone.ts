import {DateTimeTimeZone} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeDateTimeTimeZone(writer: SerializationWriter, dateTimeTimeZone: DateTimeTimeZone | undefined = {}) : void {
        for (const [key, value] of Object.entries(dateTimeTimeZone)){
            switch(key){
                case "dateTime":
                    writer.writeStringValue("dateTime", dateTimeTimeZone.dateTime);
                break
                case "timeZone":
                    writer.writeStringValue("timeZone", dateTimeTimeZone.timeZone);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
