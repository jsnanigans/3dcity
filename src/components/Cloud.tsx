import { useFrame } from "@react-three/fiber";
import React, { FC, useMemo, useRef } from "react";
import { Euler, Vector3 } from "three";

interface Cloud {
  pos: Vector3;
  rot: Euler;
  scale: number;
}

export const rangeX = [-50, 70];
export const rangeZ = [-30, 90];

const rndSpeed = () => Math.random() * 0.007;

// Create a cloud of random blobs, each with a random position, rotation, and size
const Cloud: FC<{ position: Vector3 }> = ({ position }) => {
  const ref = useRef<THREE.Mesh>(null!);

  const rndCloudBlobs: Cloud[] = useMemo(() => {
    return Array.from({ length: 5 }, () => {
      const rndPos = [
        Math.random() * 3 - 1.5,
        Math.random() * 1 - 0.5,
        Math.random() * 3 - 1.5,
      ];
      // const rndRot = [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2]
      const rndScale = Math.random() * 0.5 + 0.5;
      return {
        pos: new Vector3(...rndPos),
        rot: new Euler(),
        scale: rndScale,
      };
    });
  }, []);

  useFrame(() => {
    // animate clouds ref
    ref.current.position.z += rndSpeed();
    ref.current.position.x += rndSpeed();

    // reset cloud position if it goes out of bounds
    if (ref.current.position.z > rangeZ[1]) {
      ref.current.position.z = rangeZ[0];
    } else if (ref.current.position.z < rangeZ[0]) {
      ref.current.position.z = rangeZ[1];
    } else if (ref.current.position.x > rangeX[1]) {
      ref.current.position.x = rangeX[0];
    } else if (ref.current.position.x < rangeX[0]) {
      ref.current.position.x = rangeX[1];
    }
  });

  return (
    <mesh position={position} ref={ref}>
      {rndCloudBlobs.map((blob, i) => (
        <mesh
          key={i}
          position={blob.pos}
          rotation={blob.rot}
          scale={[blob.scale, blob.scale, blob.scale]}
          castShadow
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshLambertMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      ))}
    </mesh>
  );
};

export default Cloud;
