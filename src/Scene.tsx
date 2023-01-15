import { FC, ReactNode } from "react";
import { Euler, Vector3 } from "three";
import BasicHouse from "./components/buildings/BasicHouse";
import Grid, { PlacedGridObject } from "./lib/Grid";

const grid = new Grid(100, 60);
// grid.debug();

const gridMatrix = grid.toMatrix();

const Cell = (props: { color?: string }) => {
  const { color = "#000000" } = props;
  return (
    <mesh>
      <boxGeometry args={[0.2, 0.05, 0.2]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};

const GridElPosition: FC<{ object: PlacedGridObject | null, children: ReactNode }> = ({
  object,
  children,
}) => {
  if (!object) return null;

  return (
    <mesh
      position={new Vector3(object.x, 0, object.y)}
      onClick={(e) => console.log(object)}
    >
      {children}
    </mesh>
  );
};

const GridElement: FC<{ object: PlacedGridObject | null }> = (props) => {
  const { object } = props;

  switch (object?.obj.name) {
    case "basicHouse":
      return <GridElPosition object={props.object}><BasicHouse /></GridElPosition>;
    default:
      return null;
  }
};

const Scene = () => {
  const scenePosition = new Vector3(0, 0, 0);
  // offset position to enter the center of the grid
  scenePosition.x = -grid.width / 2;
  scenePosition.z = -grid.height / 2;
  scenePosition.y = -1;

  const floorPadding = 0;
  const widthPadded = grid.width + floorPadding;
  const heightPadded = grid.height + floorPadding;

  return (
    <mesh position={scenePosition}>
      {/* Floor */}
      <mesh
        position={
          new Vector3(
            widthPadded / 2 - floorPadding / 2,
            -1,
            heightPadded / 2 - floorPadding / 2
          )
        }
        rotation={new Euler(-Math.PI / 2, 0, 0)}
      >
        <boxGeometry args={[widthPadded, heightPadded, 0.5]} />
        <meshLambertMaterial color={"#333333"} />
      </mesh>

      {/* Grid */}
      {gridMatrix.map((row, x) =>
        row.map((_, y) => {
          const object = grid.get(x, y);
          return <GridElement key={`${y}-${x}`} object={object} />;
        })
      )}
    </mesh>
  );
};

export default Scene;
