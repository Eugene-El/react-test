import { IDragTreeItemModel } from "./IDragTreeItemModel";

export interface IDragTreeState {
    
    items: IDragTreeItemModel[]
    dragItem?: IDragTreeItemModel;

}