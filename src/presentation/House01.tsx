import React, { FC } from "react";

const House01: FC = () => {
  const color = "#5a5a5a";
  const rndColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };
  // cute house with a chimney
  return (
    <mesh position={[0,0,0]}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Roof */}
      <mesh
        receiveShadow
        castShadow
        position={[0, 0.9, 0]}
        rotation={[0, Math.PI / 4, 0]}
      >
        <coneGeometry args={[0.9, 0.9, 4]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Chimney */}
      <mesh receiveShadow castShadow position={[0.4, 0.9, 0.2]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </mesh>
  );
};

export default House01;
