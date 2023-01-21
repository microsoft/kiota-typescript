import {deserializeIntoEntity} from './deserializeIntoEntity';
import {OutlookItem} from './index';
import {DeserializeIntoModelFunction, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoOutlookItem(outlookItem: OutlookItem | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        ...deserializeIntoEntity(outlookItem),
        "categories": n => { outlookItem.categories = n.getCollectionOfPrimitiveValues<string>(); },
        "changeKey": n => { outlookItem.changeKey = n.getStringValue(); },
        "createdDateTime": n => { outlookItem.createdDateTime = n.getDateValue(); },
        "lastModifiedDateTime": n => { outlookItem.lastModifiedDateTime = n.getDateValue(); },
    }
}
