import { Euler, Vector3 } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import House01 from "../presentation/House01";
import * as THREE from "three";
import InstancedThing from "../InstancedThing";

export interface BuildingProps {
  position: [number, number, number];
  rotation?: Euler;
  size?: [number, number, number];
  scale?: Vector3;
  color?: string;
}


const Building = (props: BuildingProps) => {
  const size = props.size ?? [1, 2, 1];
  const yOffset = 0.5;
  const { position, rotation, scale, color = "#393e84" } = props;
  position[1] += yOffset;
  return (
    <>
      {/* Mesh for a building */}
      <mesh
        rotation={props.rotation}
        scale={props.scale}
        position={position}
        // align bottom
        receiveShadow
        castShadow
      >
        {/* <boxGeometry args={size} attach="geometry" />
        <meshLambertMaterial color={color} /> */}
        {/* <meshStandardMaterial color={props.color ?? '#ad9934'} /> */}

        <House01 />
      </mesh>
    </>
  );
};

export default Building;
