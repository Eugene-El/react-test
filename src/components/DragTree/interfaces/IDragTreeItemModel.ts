
export type IdType = number | string;

export interface IDragTreeItemModel {

    id: IdType;
    name: string;
    items?: IDragTreeItemModel[];
    open?: boolean;

}