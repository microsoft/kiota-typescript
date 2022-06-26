import {MailFoldersResponseImpl} from './index';
import {ParseNode} from '@microsoft/kiota-abstractions';

export function createMailFoldersResponseFromDiscriminatorValue(parseNode: ParseNode | undefined) : MailFoldersResponseImpl {
    if(!parseNode) throw new Error("parseNode cannot be undefined");
    return new MailFoldersResponseImpl();
}
