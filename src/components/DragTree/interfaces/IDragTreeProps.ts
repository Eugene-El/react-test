import { IDragTreeItemModel } from "./IDragTreeItemModel";

export interface IDragTreeProps {

    items: IDragTreeItemModel[];
    onItemsChange?: (items: IDragTreeItemModel[]) => void;
    
}