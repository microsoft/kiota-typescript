
export interface ChildFoldersRequestBuilderGetQueryParameters{
    /** Include count of items  */
    count?: boolean | undefined;
    /** Expand related entities  */
    expand?: string[] | undefined;
    /** Filter items by property values  */
    filter?: string | undefined;
    /** Order items by property values  */
    orderby?: string[] | undefined;
    /** Select properties to be returned  */
    select?: string[] | undefined;
    /** Skip the first n items  */
    skip?: number | undefined;
    /** Show only the first n items  */
    top?: number | undefined;
}
