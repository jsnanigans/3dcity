import { Vector3 } from "three";

export interface GridObject {
  name: string;
  size: Vector3;
  symbol: string;
}

export interface PlacedGridObject {
  obj: GridObject;
  x: number;
  y: number;
}

type GridMatrix = (PlacedGridObject | null)[][];
export default class Grid {
  public width: number;
  public height: number;
  placedObjects: PlacedGridObject[] = [];

  availableObjects: GridObject[] = [
    {
      name: "basicHouse",
      size: new Vector3(1, 3, 1),
      symbol: "H",
    },
  ];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.placeTestObjects();
  }

  get(x: number, y: number): PlacedGridObject | null {
    return this.placedObjects.find((o) => o.x === x && o.y === y) || null;
  }

  canPlaceObject(obj: GridObject, x: number, y: number) {
    if (x < 0 || y < 0 || x + obj.size.x > this.width || y + obj.size.z > this.height) {
      return false;
    }

    for (let i = 0; i < obj.size.x; i++) {
      for (let j = 0; j < obj.size.z; j++) {
        if (this.get(x + i, y + j)) {
          return false;
        }
      }
    }

    return true;
  }

  placeObject(obj: GridObject, x: number, y: number) {
    if (this.canPlaceObject(obj, x, y)) {
      this.placedObjects.push({ obj, x, y });
    }
  }

  placeTestObjects() {
    // place a few objects at random positions
    let fuse = 400;
    while (this.placedObjects.length < 250) {
      if (fuse-- < 0) {
        console.error("Could not place all objects", this.placedObjects.length);
        break;
      }

      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      const obj = this.availableObjects[0];
      this.placeObject(obj, x, y);
    }
  }

  toMatrix(): GridMatrix {
    const matrix: GridMatrix = [];

    for (let i = 0; i < this.width; i++) {
      matrix[i] = [];
      for (let j = 0; j < this.height; j++) {
        matrix[i][j] = this.get(i, j);
      }
    }

    return matrix;
  }

  debug() {
    const matrix = this.toMatrix();
    
    console.log(
      matrix
        .map((row) => row.map((o) => o?.obj.symbol || "•").join(" "))
        .join("\n")
    );
  }
}
