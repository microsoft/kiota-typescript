import {Entity} from './index';
import {Parsable} from '@microsoft/kiota-abstractions';

export interface SingleValueLegacyExtendedProperty extends Entity, Partial<Parsable> {
    /** A property value. */
    value?: string | undefined;
}
