import React from "react";
import classes from "./DragTree.module.css";
import { IDragTreeItemModel, IdType } from "./interfaces/IDragTreeItemModel";
import { IDragTreeProps } from "./interfaces/IDragTreeProps";
import { IDragTreeState } from "./interfaces/IDragTreeState";

type SpotPosition = "before" | "after";

export class DragTree extends React.Component<IDragTreeProps, IDragTreeState> {

    constructor(props: IDragTreeProps) {
        super(props);
        this.state = {
            items: props.items
        };
    }
    
    render() {
        return <div className={classes.dragTree}>
            {this.state.items.map(i => this.drawDragTreeItem(i))}
        </div>
    }

    drawDragTreeItem(item: IDragTreeItemModel) {
        const items = item.items ?? [];
        return <div key={item.id}>
            {this.drawSpot(item, "before")}
            <div className={`${classes.dragTreeItem} ${this.state.dragItem?.id === item.id ? classes.dragInProcess : ''}`}
                onClick={() => this.toggleItem(item.id)}
                onDragStart={() => this.dragStart(item.id)}
                onDragEnd={() => this.dragEnd(item.id)}
                onDragEnter={(e) => e.currentTarget.classList.add(classes.overItem)}
                onDragLeave={(e) => e.currentTarget.classList.remove(classes.overItem)}
                onDrop={(e) => {
                    e.currentTarget.classList.remove(classes.overItem);
                    this.dropOnItem(item);
                }}
                onDragOver={this.dragOver}
                draggable="true">
                <svg viewBox="0 0 24 24" className={item.open ? classes.open : ''}>
                    {items.length > 0 &&
                        <path xmlns="http://www.w3.org/2000/svg" d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z" />
                    }
                </svg>
                <span
                onDragOver={this.dragOver}
                >{item.name}</span>
            </div>
            <div className={`${classes.dragTreeItemTree} ${item.open ? classes.open : ''}`}>
                <div>
                    {items.map(i => this.drawDragTreeItem(i))}
                </div>
            </div>
            {this.drawSpot(item, "after")}
        </div>;
    }

    drawSpot(item: IDragTreeItemModel, position: SpotPosition) {
        return <div className={classes.spot}
            onDragEnter={(e) => e.currentTarget.classList.add(classes.over)}
            onDragLeave={(e) => e.currentTarget.classList.remove(classes.over)}
            onDragOver={this.dragOver}
            onDrop={(e) => {
                e.currentTarget.classList.remove(classes.over);
                this.dropOnSpot(item, position);
            }}>
        </div>;
    }

    //#region Data methods

    protected findItem(id: IdType, arr: IDragTreeItemModel[] = this.state.items): IDragTreeItemModel | undefined {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (item.id === id)
                return item;
            const result = this.findItem(id, item.items ?? []);
            if (result)
                return result;
        }
        return undefined;
    }

    protected removeItem(id: IdType, arr: IDragTreeItemModel[] = this.state.items): IDragTreeItemModel[] {
        const newArr = arr.filter(i => i.id !== id);
        newArr.forEach(item => {
            if (item.items)
                item.items = this.removeItem(id, item.items);
        });
        return newArr;
    }

    protected findItemParent(
        id: IdType,
        arr: IDragTreeItemModel[] = this.state.items,
        parent: IDragTreeItemModel | undefined = undefined): IDragTreeItemModel | undefined {
    
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (item.id === id)
                return parent;
            const result = this.findItemParent(id, item.items ?? [], item);
            if (result)
                return result;
        }
        return undefined;
    }

    //#endregion

    protected toggleItem(id: IdType) {
        const item = this.findItem(id);
        if (!item) return;

        item.open = !item.open;
        this.setState(this.state);
        this.callCallback();
    }

    protected dragStart(id: IdType) {
        const item = this.findItem(id);
        if (!item) return;

        this.setState({
            items: this.state.items,
            dragItem: item
        });
    }

    protected dragEnd(id: IdType) {
        const item = this.findItem(id);
        if (!item) return;

        this.setState({
            items: this.state.items,
            dragItem: undefined
        });
    }

    protected dragOver(e: any) {
        e.preventDefault();
        return false;
    }


    protected dropOnItem(item: IDragTreeItemModel) {
        if (!this.state.dragItem || this.state.dragItem.id === item.id)
            return;

        const newItems = this.removeItem(this.state.dragItem.id);

        if (!item.items)
            item.items = [];

        item.items.push(this.state.dragItem);

        this.setState({
            items: newItems,
            dragItem: undefined
        });
        this.callCallback();
    }

    protected dropOnSpot(item: IDragTreeItemModel, position: SpotPosition) {
        if (!this.state.dragItem || this.state.dragItem.id === item.id)
            return;

        const parent = this.findItemParent(item.id);
        let newItems = this.removeItem(this.state.dragItem.id);

        let arr = parent ? (parent.items ?? []) : newItems;
        const index = arr.indexOf(item) + (position === "before" ? 0 : 1);
        arr = [
            ...arr.slice(0, index),
            this.state.dragItem,
            ...arr.slice(index)
        ];
        if (parent) {
            parent.items = arr;
        } else {
            newItems = arr;
        }

        this.setState({
            items: newItems,
            dragItem: undefined
        });
        this.callCallback();
    }

    protected callCallback() {
        setTimeout(() => {
            if (this.props.onItemsChange)
                this.props.onItemsChange(this.state.items);
        });
    }

}