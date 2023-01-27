import {FollowupFlagStatus} from './followupFlagStatus';
import {DateTimeTimeZone, FollowupFlag} from './index';
import {serializeDateTimeTimeZone} from './serializeDateTimeTimeZone';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeFollowupFlag(writer: SerializationWriter, followupFlag: FollowupFlag | undefined = {}) : void {
        for (const [key, value] of Object.entries(followupFlag)){
            switch(key){
                case "completedDateTime":
                    writer.writeObjectValue<DateTimeTimeZone>("completedDateTime", followupFlag.completedDateTime, serializeDateTimeTimeZone);
                break
                case "dueDateTime":
                    writer.writeObjectValue<DateTimeTimeZone>("dueDateTime", followupFlag.dueDateTime, serializeDateTimeTimeZone);
                break
                case "flagStatus":
                    writer.writeEnumValue<FollowupFlagStatus>("flagStatus", followupFlag.flagStatus);
                break
                case "startDateTime":
                    writer.writeObjectValue<DateTimeTimeZone>("startDateTime", followupFlag.startDateTime, serializeDateTimeTimeZone);
                break
                default:
                writer.writeAdditionalData(key, value);
                break
            }
        }
}
