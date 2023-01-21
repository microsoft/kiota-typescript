import {FollowupFlagStatus} from './followupFlagStatus';
import {DateTimeTimeZone, FollowupFlag} from './index';
import {serializeDateTimeTimeZone} from './serializeDateTimeTimeZone';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function serializeFollowupFlag(writer: SerializationWriter, followupFlag: FollowupFlag | undefined = {}) : void {
            writer.writeObjectValue<DateTimeTimeZone>("completedDateTime", followupFlag.completedDateTime, serializeDateTimeTimeZone);
            writer.writeObjectValue<DateTimeTimeZone>("dueDateTime", followupFlag.dueDateTime, serializeDateTimeTimeZone);
            writer.writeEnumValue<FollowupFlagStatus>("flagStatus", followupFlag.flagStatus);
            writer.writeObjectValue<DateTimeTimeZone>("startDateTime", followupFlag.startDateTime, serializeDateTimeTimeZone);
}
