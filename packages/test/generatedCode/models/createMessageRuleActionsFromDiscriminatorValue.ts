import {deserializeIntoMessageRuleActions} from './deserializeIntoMessageRuleActions';
import {MessageRuleActions} from './messageRuleActions';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createMessageRuleActionsFromDiscriminatorValue(parseNode: ParseNode | undefined) {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return deserializeIntoMessageRuleActions;
}
