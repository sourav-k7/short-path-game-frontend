import { useState } from "react";
import { ACTION_TYPE, CELL_TYPE } from "./constants";

function App() {
  let initialGridState = Array(400)
    .fill(null)
    .map((_, index) => ({
      id: index,
      cellType: CELL_TYPE.EMPTY,
    }));
  const [grid, setGrid] = useState(initialGridState);

  const [actionType, setActionType] = useState(ACTION_TYPE.START);

  function getCellBgColor(celltype) {
    switch (celltype) {
      case CELL_TYPE.EMPTY:
        return "bg-yellow-200";
      case CELL_TYPE.START:
        return "bg-teal-400";
      case CELL_TYPE.END:
        return "bg-red-400";
      case CELL_TYPE.BLOCKED:
        return "bg-gray-400";
      default:
        break;
    }
  }

  function handleCellClick(clickedCellId) {
    if (actionType === ACTION_TYPE.START) {
      setGrid((state) => {
        let newState = [...initialGridState];
        state.forEach((cell) => {
          if (cell.cellType !== CELL_TYPE.START) {
            newState[cell.id].cellType = cell.cellType;
          }
        });
        newState[clickedCellId].cellType = CELL_TYPE.START;
        return newState;
      });
    }
    if (actionType === ACTION_TYPE.END) {
      setGrid((state) => {
        let newState = [...initialGridState];
        state.forEach((cell) => {
          if (cell.cellType !== CELL_TYPE.END) {
            newState[cell.id].cellType = cell.cellType;
          }
        });
        newState[clickedCellId].cellType = CELL_TYPE.END;
        return newState;
      });
    }
    if (actionType === ACTION_TYPE.BLOCK) {
      setGrid((state) => {
        let newState = [...state];
        newState[clickedCellId].cellType =
          newState[clickedCellId].cellType === CELL_TYPE.BLOCKED
            ? CELL_TYPE.EMPTY
            : CELL_TYPE.BLOCKED;
        return newState;
      });
    }
  }
  function handleSubmit() {}

  return (
    <div className="flex justify-center gap-10 my-10">
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}
      >
        {grid.map((cell) => {
          return (
            <div
              key={cell.id}
              className={`h-5 w-5 rounded-sm ${getCellBgColor(cell.cellType)}`}
              onClick={() => handleCellClick(cell.id)}
            />
          );
        })}
      </div>
      <div className="flex flex-col gap-5">
        <button
          className="border-teal-400 border-[1px] border-solid rounded px-4"
          onClick={() => {
            setActionType(ACTION_TYPE.START);
          }}
        >
          Select Start Cell
        </button>
        <button
          className="border-red-400 border-[1px] border-solid rounded px-4"
          onClick={() => setActionType(ACTION_TYPE.END)}
        >
          Select End Cell
        </button>
        <button
          className="border-gray-400 border-[1px] border-solid rounded px-4"
          onClick={() => setActionType(ACTION_TYPE.BLOCK)}
        >
          Select Blocked Cell
        </button>
        <button
          className="bg-teal-400 border-teal-400 border-[1px] border-solid rounded px-4"
          onClick={handleSubmit}
        >
          Find Shortest Path
        </button>
        <button
          className="border-red-400 bg-red-400 border-[1px] border-solid rounded px-4"
          onClick={() => setGrid(initialGridState)}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
