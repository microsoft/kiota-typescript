import {MessageRulesResponseImpl} from './index';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createMessageRulesResponseFromDiscriminatorValue(parseNode: ParseNode | undefined) : MessageRulesResponseImpl {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return new MessageRulesResponseImpl();
}
