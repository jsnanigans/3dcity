import React, { FC, useMemo } from 'react'

// simple tree with a trunk and a crown of leaves as three spheres in random positions
const Tree: FC<{
  position?: [number, number, number]
}> = (props) => {
  const {position = [0, 0, 0]} = props
  position[1] += 0.5 // align bottom

  const trunkColor = '#524224'
  const crownColor = '#05623d'
  // set random positions for the crown
  const crownPos = useMemo(() => [
    [0, 0.6, 0],
    [0, .85, 0],
    [0, 1.1, 0],
  ], []);

  return (
    <mesh position={position}>
      {/* Trunk */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1, 32]} />
        <meshLambertMaterial color={trunkColor} />
      </mesh>

      {/* Crown */}
      <mesh receiveShadow castShadow position={crownPos[0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshLambertMaterial color={crownColor} />
      </mesh>
      <mesh receiveShadow castShadow position={crownPos[1]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshLambertMaterial color={crownColor} />
      </mesh>
      <mesh receiveShadow castShadow position={crownPos[2]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshLambertMaterial color={crownColor} />
      </mesh>
    </mesh>
  )
}

export default Tree
