import React, { FC, useMemo } from "react";
import { rndColor } from "../lib/rnd";

const House01: FC = () => {
  const rndBaseColor = useMemo(()=>{
    return rndColor({lightness: 0.3});
  }, [])

  const rndAccentColor = useMemo(()=>{
    return rndColor({lightness: 0.6});
  }, [])
  // cute house with a chimney
  return (
    <mesh position={[0,0,0]}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={rndBaseColor} />
      </mesh>

      {/* Roof */}
      <mesh
        receiveShadow
        castShadow
        position={[0, 0.9, 0]}
        rotation={[0, Math.PI / 4, 0]}
      >
        <coneGeometry args={[0.9, 0.9, 4]} />
        <meshLambertMaterial color={rndBaseColor} />
      </mesh>

      {/* Chimney */}
      <mesh receiveShadow castShadow position={[0.4, 0.9, 0.2]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshLambertMaterial color={rndBaseColor} />
      </mesh>

      {/* Main Door */}
      <mesh receiveShadow position={[0, -0.25, 0.5]}>
        <boxGeometry args={[0.3, 0.5, 0.05]} />
        <meshLambertMaterial color={rndAccentColor} />
      </mesh>

      {/* Pathway */}
      <mesh receiveShadow position={[0, -0.5, 0.45]}>
        <boxGeometry args={[0.5, 0.05, 1.1]} />
        <meshLambertMaterial color={rndBaseColor} />
      </mesh>
    </mesh>
  );
};

export default House01;
