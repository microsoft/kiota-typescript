import {Entity} from './entity';

export interface MultiValueLegacyExtendedProperty extends Entity{
    /** A collection of property values. */
    value?:string[] | undefined;
}
