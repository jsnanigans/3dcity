import { Euler, Vector3 } from "three";
import { Clouds } from "./Clouds";
import Building, { BuildingProps } from "./components/Building";
import Cloud from "./components/Cloud";
import Street from "./components/Street";
import Tree from "./components/Tree";
import {
  addStreetsToGrid,
  debugGrid,
  generateGrid,
  parseGridCell,
  placeRandomBuildingOnGrid,
  placeRandomStreetsOnGrid,
  placeRandomTreesOnGrid,
} from "./lib/grid";

let grid = generateGrid(20, 20);
grid = addStreetsToGrid(grid, [{
  direction: 'horizontal',
  x: 0,
  y: 8,
  length: 20
}]);
grid = placeRandomStreetsOnGrid(grid, 10);
grid = placeRandomBuildingOnGrid(grid, 40);
grid = placeRandomTreesOnGrid(grid, 60);
const gridWidth = grid[0].length;
const gridHeight = grid.length;

debugGrid(grid);

const Scene = () => {
  const offsetWholeScene = new Vector3(-gridWidth, 0, -gridHeight);
  return (
    <mesh position={offsetWholeScene}>
      {/* Floor mesh */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4000, 4000]} />
        <meshLambertMaterial color={"#0c552c"} />
      </mesh>

      {/* Place 20 Streets on either side of the grid */}
      {Array.from(Array(40).keys()).map((index) => {
        let offset = index <= 20 ? -42 : -2;
        return (
          <Street
            key={index}
            position={[offset + index * 2, 0, 16]}
            // rotation={[0, Math.PI / 2, 0]}
            cell={{
              type: "street",
              streetType: "horizontal",
              x: index,
              y: -1,
            }}
          />
        );
      })}

      <Clouds />

      {/* Render Grid */}
      {grid.map((row, rowIndex) => {
        return row.map((cell, cellIndex) => {
          const cellDetails = parseGridCell(grid, [rowIndex, cellIndex]);
          if (cellDetails.type === "empty") {
            // render placeholder
            return (
              <mesh
                key={`${rowIndex}-${cellIndex}`}
                position={[rowIndex * 2, 0, cellIndex * 2]}
                onClick={() => {
                  console.log("clicked on empty cell", rowIndex, cellIndex);
                }}
              >
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshLambertMaterial
                  color={"#eeeeee"}
                  opacity={0}
                  transparent
                />
                {/* text with cell position */}
              </mesh>
            );
          }
          if (cellDetails.type === "street") {
            return (
              <Street
                key={`${rowIndex}-${cellIndex}`}
                position={[rowIndex * 2, 0, cellIndex * 2]}
                cell={cellDetails}
              />
            );
          }
          if (cellDetails.type === "building") {
            return (
              <Building
                key={`${rowIndex}-${cellIndex}`}
                position={[rowIndex * 2, 0, cellIndex * 2]}
                cell={cellDetails}
                // look at road
              />
            );
          }
          if (cellDetails.type === "tree") {
            return (
              <Tree
                key={`${rowIndex}-${cellIndex}`}
                position={[rowIndex * 2, 0, cellIndex * 2]}
              />
            );
          }
        });
      })}

      {/* Buildings */}
      {/* {buildings.map((building, index) => (
        <Building key={index} {...building} />
      ))} */}
    </mesh>
  );
};

export default Scene;
