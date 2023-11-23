import './App.css';
import { DragTree } from './components/DragTree/DragTree';

const items = [
  { id: 1, name: "Group 1", items: [
      { id: 2, name: "Item 1" },
      { id: 3, name: "Item 2" },
      { id: 4, name: "Item 3 G", items: [
          { id: 6, name: "Sub item G"}
      ] },
  ]},
  { id: 5, name: "Item 4" }
];

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <DragTree items={items} onItemsChange={items => {
          console.log("Items: ", JSON.stringify(items, null, "\t"));
        }}/>
      </div>
    </div>
  );
}

export default App;
