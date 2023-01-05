import { useFrame } from '@react-three/fiber'
import React, { FC, useMemo, useRef, useState } from 'react'
import { Vector3 } from 'three'
import Cloud, { rangeX, rangeZ } from './components/Cloud'

const rndX = () => (Math.random() * rangeX[1]) + rangeX[0];
const rndZ = () => (Math.random() * rangeZ[1]) + rangeZ[0];

export const Clouds: FC = () => {
  // rnd cloud positions
  const clouds = useMemo(() => {
    return Array.from({length: 20}, () => new Vector3(rndX(), 10, rndZ()))
  }, [])

  return (
    <mesh position={[0,10,0]}>
      {clouds.map((cloud, i) => (
        <Cloud key={i} position={cloud} />
      ))}
    </mesh>
  )
}
