import {createDateTimeTimeZoneFromDiscriminatorValue} from './createDateTimeTimeZoneFromDiscriminatorValue';
import {FollowupFlagStatus} from './followupFlagStatus';
import {DateTimeTimeZone, FollowupFlag} from './index';
import {AdditionalDataHolder, DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoFollowupFlag(followupFlag: FollowupFlag | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "completedDateTime": n => { followupFlag.completedDateTime = n.getObjectValue<DateTimeTimeZone>(createDateTimeTimeZoneFromDiscriminatorValue); },
        "dueDateTime": n => { followupFlag.dueDateTime = n.getObjectValue<DateTimeTimeZone>(createDateTimeTimeZoneFromDiscriminatorValue); },
        "flagStatus": n => { followupFlag.flagStatus = n.getEnumValue<FollowupFlagStatus>(FollowupFlagStatus); },
        "startDateTime": n => { followupFlag.startDateTime = n.getObjectValue<DateTimeTimeZone>(createDateTimeTimeZoneFromDiscriminatorValue); },
    }
}
