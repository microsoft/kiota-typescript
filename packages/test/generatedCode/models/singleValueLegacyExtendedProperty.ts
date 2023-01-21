import {Entity} from './index';
import {Parsable} from '@microsoft/kiota-abstractions';

export interface SingleValueLegacyExtendedProperty extends Entity, Parsable {
    /** A property value. */
    value?: string | undefined;
}
