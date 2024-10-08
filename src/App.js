import { useState } from "react";
import { ACTION_TYPE, CELL_TYPE } from "./constants";
import axios from "./utils/axios";

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
      case CELL_TYPE.PATH:
        return "bg-blue-400";
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
  async function handleSubmit() {
    setActionType(ACTION_TYPE.SUBMIT);
    let startCell = grid.find((cell) => cell.cellType === CELL_TYPE.START);
    let endCell = grid.find((cell) => cell.cellType === CELL_TYPE.END);
    if (!startCell || !endCell) {
      return;
    }
    let startCellCoord = [parseInt(startCell.id / 20), startCell.id % 20];
    let endCellCoord = [parseInt(endCell.id / 20), endCell.id % 20];
    const res = await axios.post("/find-path", {
      start: startCellCoord,
      end: endCellCoord,
    });
    let { path = [] } = res.data;
    path = path.map((cell) => cell[0] * 20 + cell[1]);
    path = path.filter(
      (cellId) => cellId !== startCell.id && cellId !== endCell.id
    );
    setGrid((state) => {
      let newState = [...state];
      path.forEach((cellId) => {
        newState[cellId].cellType = CELL_TYPE.PATH;
      });
      return newState;
    });
  }

  function handleSetActionType(type) {
    if (actionType === ACTION_TYPE.SUBMIT) {
      setGrid(initialGridState);
    }
    setActionType(type);
  }

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
            handleSetActionType(ACTION_TYPE.START);
          }}
        >
          Select Start Cell
        </button>
        <button
          className="border-red-400 border-[1px] border-solid rounded px-4"
          onClick={() => handleSetActionType(ACTION_TYPE.END)}
        >
          Select End Cell
        </button>
        <button
          className="border-gray-400 border-[1px] border-solid rounded px-4"
          onClick={() => handleSetActionType(ACTION_TYPE.BLOCK)}
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
