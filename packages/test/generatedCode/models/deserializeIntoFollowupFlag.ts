import {deserializeIntoDateTimeTimeZone} from './deserializeIntoDateTimeTimeZone';
import {FollowupFlagStatus} from './followupFlagStatus';
import {DateTimeTimeZone, FollowupFlag} from './index';
import {AdditionalDataHolder, DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoFollowupFlag(followupFlag: FollowupFlag | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "completedDateTime": n => { followupFlag.completedDateTime = n.getObjectValue<DateTimeTimeZone>(deserializeIntoDateTimeTimeZone); },
        "dueDateTime": n => { followupFlag.dueDateTime = n.getObjectValue<DateTimeTimeZone>(deserializeIntoDateTimeTimeZone); },
        "flagStatus": n => { followupFlag.flagStatus = n.getEnumValue<FollowupFlagStatus>(FollowupFlagStatus); },
        "startDateTime": n => { followupFlag.startDateTime = n.getObjectValue<DateTimeTimeZone>(deserializeIntoDateTimeTimeZone); },
    }
}
