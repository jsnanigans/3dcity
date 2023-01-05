import { Vector3 } from "@react-three/fiber";
import roadLine from "../assets/road-line.jpg";
import roadBlank from "../assets/road-blank.jpg";
import roadEnd from "../assets/road-end.png";
import * as THREE from "three";
import { CellDetails } from "../lib/grid";
import { Euler } from "three";

export interface StreetProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number, number];
  scale?: Vector3;
  color?: string;
  cell: CellDetails;
}

const Street = (props: StreetProps) => {
  const size = props.size ?? [2, 2];
  const yOffset = 0.001;
  const {
    position = [0, 0, 0],
    rotation = [-Math.PI / 2, 0, 0],
    scale,
    color = "#333333",
    cell,
  } = props;
  let setRotation: Euler = new Euler().fromArray(rotation);

  let texture = new THREE.TextureLoader().load(roadLine);

  if (cell.streetType === "horizontal") {
    setRotation.z = Math.PI / 2;
  }

  // use blank texture for crossing
  if (cell.streetType === "crossing") {
    texture = new THREE.TextureLoader().load(roadBlank);
  }

  // use end texture for end
  if (cell.streetType === "end") {
    texture = new THREE.TextureLoader().load(roadEnd);
    // turn to face the right way
    if (cell.closestStreetDirection) {
      setRotation.z = cell.closestStreetDirection.y;
    }
  }

  return (
    <>
      {/* Mesh for a building */}
      <mesh
        rotation={setRotation}
        scale={props.scale}
        position={position}
        // align bottom
        position-y={yOffset}
        receiveShadow
        onClick={(event) => console.log("clicked street", cell, setRotation)}
      >
        <planeGeometry args={size} attach="geometry" />
        {/* <meshLambertMaterial color={color}  /> */}
        {/* add street texture */}
        <meshLambertMaterial
          map={texture}
          transparent
          opacity={1}
          color="yellow"
        />

        {/* <meshStandardMaterial color={props.color ?? '#ad9934'} /> */}
      </mesh>
    </>
  );
};

export default Street;
