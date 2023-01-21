import {deserializeIntoMessageRule} from './deserializeIntoMessageRule';
import {MessageRule} from './messageRule';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createMessageRuleFromDiscriminatorValue(parseNode: ParseNode | undefined) {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return deserializeIntoMessageRule;
}
