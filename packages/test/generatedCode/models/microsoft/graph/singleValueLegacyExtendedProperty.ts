import {Entity} from './entity';

export interface SingleValueLegacyExtendedProperty extends Entity {
    /** A property value. */
    value?: string | undefined;
}
