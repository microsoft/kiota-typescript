import {BodyType} from './bodyType';
import {ItemBody} from './index';
import {AdditionalDataHolder, DeserializeMethod, Parsable, ParseNode, SerializationWriter} from '@microsoft/kiota-abstractions';

export function deserializeIntoItemBody(itemBody: ItemBody | undefined = {}) : Record<string, (node: ParseNode) => void> {
    return {
        "content": n => { itemBody.content = n.getStringValue(); },
        "contentType": n => { itemBody.contentType = n.getEnumValue<BodyType>(BodyType); },
    }
}
