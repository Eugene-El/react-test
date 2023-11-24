import React from 'react';
import './App.css';
import { DragTree } from './components/DragTree/DragTree';
import { IDragTreeItemModel } from './components/DragTree/interfaces/IDragTreeItemModel';

const ITEMS: IDragTreeItemModel[] = [
  { id: 1, name: "Item 1", items: [
      { id: 2, name: "Item 2" },
      { id: 3, name: "Item 3" },
      { id: 4, name: "Item 4", items: [
          { id: 6, name: "Item 6"}
      ] },
  ]},
  { id: 5, name: "Item 5" }
];
let ID_COUNTER = 7;
const MAX_TREE_HEIGHT = 4;

function App() {
  const [items, setItems] = React.useState(ITEMS);

  return (
    <div className="app">
      <div className="configuration">
        <div>Max tree height: {MAX_TREE_HEIGHT}</div>
        <button onClick={() => {
          setItems([...items, {id: ID_COUNTER, name: `New item ${ID_COUNTER}`}]);
          ID_COUNTER++;
        }}>Add new item</button>
      </div>
      <br/>
      <DragTree items={items}
        maxTreeHeight={MAX_TREE_HEIGHT}
        openItemOnDrop={true}
        onItemsChange={items => {
          setItems(items);
          console.log("Items: " + JSON.stringify(items, null, " "));
        }}/>
    </div>
  );
}

export default App;
