/*
  Grid Codes:
  0 = empty
  1 = street
  2 = building
  3 = tree
*/

import { Euler } from "three";

export type CellType = 0 | 1 | 2 | 3;

export type Grid = CellType[][];

const rnd = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate a grid matrix
export const generateGrid = (width: number, height: number): Grid => {
  const grid = [];
  for (let i = 0; i < height; i++) {
    grid.push([]);
    for (let j = 0; j < width; j++) {
      grid[i].push(0);
    }
  }
  return grid;
};

interface Street {
  x: number;
  y: number;
  direction: "horizontal" | "vertical";
  length: number;
}

export const addStreetsToGrid = (grid: Grid, streets: Street[]): Grid => {
  const gridCopy = [...grid];
  for (let i = 0; i < streets.length; i++) {
    const street = streets[i];
    if (street.direction === "horizontal") {
      for (let j = 0; j < street.length; j++) {
        gridCopy[street.y][street.x + j] = 1;
      }
    } else {
      for (let j = 0; j < street.length; j++) {
        gridCopy[street.y + j][street.x] = 1;
      }
    }
  }
  // crop grid to original size
  for (let i = 0; i < grid.length; i++) {
    gridCopy[i] = gridCopy[i].slice(0, gridCopy[0].length);
  }

  return gridCopy;
};

export const placeBuildingOnGrid = (
  grid: Grid,
  buildingPos: number[]
): Grid => {
  // place buildings on the grid
  let gridCopy = [...grid];
  const [x, y] = buildingPos;

  gridCopy[y][x] = 2;

  return gridCopy;
};

export const selectRandomPointForBuilding = (
  grid: Grid
): { x: number; y: number } | undefined => {
  // place a building next to a street but not on a street or another building
  const possiblePoints = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 0) {
        // check if there is a street next to it
        if (
          grid[i - 1]?.[j] === 1 ||
          grid[i + 1]?.[j] === 1 ||
          grid[i]?.[j - 1] === 1 ||
          grid[i]?.[j + 1] === 1
        ) {
          possiblePoints.push({ x: j, y: i });
        }
      }
    }
  }
  return possiblePoints[Math.floor(Math.random() * possiblePoints.length)];
};

export const placeRandomBuildingOnGrid = (
  grid: Grid,
  buildingsCount: number
) => {
  // use selectRandomPointForBuilding and  placeBuildingsOnGrid
  let gridCopy = [...grid];
  for (let i = 0; i < buildingsCount; i++) {
    const point = selectRandomPointForBuilding(gridCopy);
    if (point) gridCopy = placeBuildingOnGrid(gridCopy, [point.x, point.y]);
  }
  return gridCopy;
};

const rndStreet = (grid: Grid): Street => {
  const x = Math.floor(Math.random() * grid[0].length);
  const y = Math.floor(Math.random() * grid.length);
  const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
  const length = Math.floor(Math.random() * 10) + 5;
  return { x, y, direction, length };
};

const validateStreet = (grid: Grid, street: Street) => {
  let valid = true;

  const isFirstStreet = grid.every((row) => row.every((cell) => cell === 0));
  const minLength = 2;

  // street has to be longer than minLength
  if (street.length < minLength) {
    valid = false;
  }

  // street has to be within the grid
  if (street.direction === "horizontal") {
    if (street.x + street.length > grid[0].length) {
      valid = false;
    }
  }
  if (street.direction === "vertical") {
    if (street.y + street.length > grid.length) {
      valid = false;
    }
  }

  // check all cells on the sides of the street, only one cell can be a street
  if (street.direction === "horizontal") {
    for (let i = 0; i < street.length; i++) {
      if (grid[street.y - 1]?.[street.x + i] === 1) {
        valid = false;
      }
      if (grid[street.y + 1]?.[street.x + i] === 1) {
        valid = false;
      }

      if (grid[street.y - 2]?.[street.x + i] === 1) {
        valid = false;
      }
      if (grid[street.y + 2]?.[street.x + i] === 1) {
        valid = false;
      }
    }
  }
  if (street.direction === "vertical") {
    for (let i = 0; i < street.length; i++) {
      if (grid[street.y + i]?.[street.x - 1] === 1) {
        valid = false;
      }
      if (grid[street.y + i]?.[street.x + 1] === 1) {
        valid = false;
      }

      if (grid[street.y + i]?.[street.x - 2] === 1) {
        valid = false;
      }
      if (grid[street.y + i]?.[street.x + 2] === 1) {
        valid = false;
      }
    }
  }

  // street has to branch out from another street, except for the first street
  if (!isFirstStreet) {
    if (street.direction === "horizontal") {
      if (
        grid[street.y]?.[street.x - 1] !== 1 &&
        grid[street.y]?.[street.x + street.length] !== 1
      ) {
        valid = false;
      }
    }
    if (street.direction === "vertical") {
      if (
        grid[street.y - 1]?.[street.x] !== 1 &&
        grid[street.y + street.length]?.[street.x] !== 1
      ) {
        valid = false;
      }
    }
  }

  // street cannot just be an extension of another street
  if (street.direction === "horizontal") {
    for (let i = 0; i < street.length; i++) {
      if (grid[street.y]?.[street.x + i] === 1) {
        valid = false;
      }

      if (grid[street.y - 1]?.[street.x + i] === 1) {
        valid = false;
      }
      if (grid[street.y + 1]?.[street.x + i] === 1) {
        valid = false;
      }
    }
  }
  if (street.direction === "vertical") {
    for (let i = 0; i < street.length; i++) {
      if (grid[street.y + i]?.[street.x] === 1) {
        valid = false;
      }

      if (grid[street.y + i]?.[street.x - 1] === 1) {
        valid = false;
      }
      if (grid[street.y + i]?.[street.x + 1] === 1) {
        valid = false;
      }
    }
  }

  return valid;
};
// check if street is out of bounds  }

export const placeRandomStreetsOnGrid = (
  grid: Grid,
  streetsCount: number
) => {
  let addedStreets = 0;
  let gridCopy = [...grid];
  let fuse = 0;
  while (addedStreets < streetsCount) {
    fuse++;
    if (fuse > 5000) {
      console.log("fuse");
      break;
    }

    const street = rndStreet(gridCopy);
    if (validateStreet(gridCopy, street)) {
      gridCopy = addStreetsToGrid(gridCopy, [street]);
      addedStreets++;
    }
  }
  return gridCopy;
};

export const debugGrid = (grid: Grid) => {
  // prints the grid to the console for debugging in a nice format
  const string = [];
  for (let i = 0; i < grid.length; i++) {
    string.push(grid[i].join(" "));
  }
  console.log(string.join("\n").replaceAll("0", "-"));
};

// const testGrid = generateGrid(10, 10);
// const withStreets = addStreetsToGrid(testGrid, [
//   { x: 2, y: 5, direction: 'horizontal', length: 10 },
// ]);

// debugGrid(withStreets);

export type StreetType = "horizontal" | "vertical" | "crossing";
export type CellTypeText = "empty" | "street" | "building" | "tree";

export interface CellDetails {
  x: number;
  y: number;
  type: CellTypeText;
  streetType?: StreetType;
  closestStreetDirection?: Euler;
}

export const parseGridCell = (grid: Grid, cell: number[]): CellDetails => {
  const [x, y] = cell;
  // const type =
  //   grid[y][x] === 0 ? "empty" : grid[y][x] === 1 ? "street" : "building";

  let type: CellTypeText = "empty";
  if (grid[y][x] === 1) type = "street";
  if (grid[y][x] === 2) type = "building";
  if (grid[y][x] === 3) type = "tree";

  const neighbours = [
    grid[y - 1]?.[x],
    grid[y + 1]?.[x],
    grid[y]?.[x - 1],
    grid[y]?.[x + 1],
  ];

  let streetType: StreetType | undefined;

  if (type === "street") {
    if (grid[y][x - 1] === 1 || grid[y][x + 1] === 1) streetType = "horizontal";
    else streetType = "vertical";

    // check if street cell is a crossing, a crossing has 3 or more streets around it
    if (neighbours.filter((n) => n === 1).length >= 3) {
      streetType = "crossing";
    }
  }

  let closestStreetDirection: Euler | undefined;
  if (type === "building") {
    // check which direction the closest street is in
    if (grid[y - 1]?.[x] === 1) closestStreetDirection = new Euler().fromArray([0, Math.PI, 0]);
    if (grid[y + 1]?.[x] === 1) closestStreetDirection = new Euler().fromArray([0, 0, 0]);
    if (grid[y]?.[x - 1] === 1) closestStreetDirection = new Euler().fromArray([0, -Math.PI / 2, 0]);
    if (grid[y]?.[x + 1] === 1) closestStreetDirection = new Euler().fromArray([0, Math.PI / 2, 0]);
  }

  return { x, y, type, streetType, closestStreetDirection };
};


export const placeRandomTreesOnGrid = (grid: Grid, treeCount = 3): Grid => {
  let gridCopy = [...grid];
  let addedTrees = 0;
  let fuse = 0;
  while (addedTrees < treeCount) {
    fuse++;
    if (fuse > 5000) {
      console.log("fuse");
      break;
    }

    const x = rnd(0, gridCopy[0].length);
    const y = rnd(0, gridCopy.length);

    if (gridCopy[y]?.[x] === 0) {
      gridCopy[y][x] = 3;
      addedTrees++;
    }
  }
  return gridCopy;
}
