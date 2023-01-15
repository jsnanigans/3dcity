import {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BufferGeometry,
  Color,
  Euler,
  InstancedMesh,
  Matrix4,
  Vector3,
} from "three";

// render a simple window, instanced to improve performance
const InstancedWindow: FC<{
  positions: Vector3[];
}> = ({ positions }) => {
  const ref = useRef<InstancedMesh<BufferGeometry>>();
  useLayoutEffect(() => {
    // set at random positions
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];

      const matrix = new Matrix4();
      matrix.setPosition(position);

      // set color
      // ref.current?.setColorAt(i, color);
      ref.current?.setMatrixAt(i, matrix);
      ref.current?.geometry.computeBoundingSphere();
    }
  }, [ref, positions]);

  return (
    <instancedMesh ref={ref} args={[null, null, positions.length]}>
      <planeGeometry args={[0.1, 0.1]} />
      <meshLambertMaterial color={"#ffffff"} />
    </instancedMesh>
  );
};

const windowGap = 0.01;
const windowSize = 0.1;
const buildingHeight = 5;
const buildingZ = 0.9;
const buildingX = 0.9;

const offsetX = (buildingX - windowSize) / 2 - windowGap;
const offsetY = (buildingHeight - windowSize) / 2 - windowGap;

const startWindowPos = new Vector3(-offsetX, offsetY, 0.4);
const endWindowPos = new Vector3(offsetX, -offsetY, 0.4);

const availableWindowPositions: Vector3[] = [];
// fill the front side with windows
for (let x = startWindowPos.x; x <= endWindowPos.x; x += windowSize + windowGap) {
  for (let y = startWindowPos.y; y >= endWindowPos.y; y -= windowSize + windowGap) {
    availableWindowPositions.push(new Vector3(x, y, 0.4));
  }
}


const BasicHouse = () => {
  // between 1 and 10 seconds
  const rndUpdateInterval = useMemo(() => {
    return Math.random() * 10000 + 1000;
  }, []);
  const [windowPositions, setWindowPositions] = useState<Vector3[][]>([
    [],
    [],
    [],
    [],
  ]);

  const buildingColor = new Color(0x111111);

  const rndWindows = useCallback(() => {
    const windows: Array<Vector3> = [];

    // pick 50-100 random windows
    const rnd = Math.floor(Math.random() * 50) + 50;
    for (let i = 0; i < rnd; i++) {
      const index = Math.floor(Math.random() * availableWindowPositions.length);
      windows.push(availableWindowPositions[index]);
    }

    return windows;
  }, []);

  const updateWindows = useCallback((windows: Vector3[]) => {
    // only update some of the times
    if (Math.random() > 0.4) {
      return windows;
    }

    // update the windows passed in to be slightly different
    const newWindows: Vector3[] = [...windows];

    const rnd = Math.floor(Math.random() * 3);
    for (let i = 0; i < rnd; i++) {
      const index = Math.floor(Math.random() * newWindows.length);
      newWindows.splice(index, 1);
    }

    const rnd2 = Math.floor(Math.random() * 3);
    for (let i = 0; i < rnd2; i++) {
      const index = Math.floor(Math.random() * availableWindowPositions.length);
      newWindows.push(availableWindowPositions[index]);
    }

    return newWindows;
  }, []);

  // every few seconds, slightly change the windows
  useEffect(() => {
    // set initial random windows
    setWindowPositions([
      rndWindows(),
      rndWindows(),
      rndWindows(),
      rndWindows(),
    ]);

    const interval = setInterval(() => {
      // set new random windows
      setWindowPositions((current) => [
        updateWindows(current[0]),
        updateWindows(current[1]),
        updateWindows(current[2]),
        updateWindows(current[3]),
      ]);
    }, rndUpdateInterval);

    return () => clearInterval(interval);
  }, [rndUpdateInterval]);

  return (
    <mesh position={[0, buildingHeight/2, 0]}>
      <boxGeometry attach="geometry" args={[buildingX, buildingHeight, buildingZ]} />
      <meshStandardMaterial attach="material" color={buildingColor} />

      {/* Front Side */}
      <mesh position={new Vector3(0.005, -0.005, 0.051)}>
        <InstancedWindow positions={windowPositions[0]} />
      </mesh>

      {/* Back Side */}
      <mesh
        position={new Vector3(0.005, -0.005, -0.051)}
        rotation={new Euler(0, Math.PI, 0)}
      >
        <InstancedWindow positions={windowPositions[1]} />
      </mesh>

      {/* Left Side */}
      <mesh
        position={new Vector3(0.051, -0.005, 0)}
        rotation={new Euler(0, Math.PI / 2, 0)}
      >
        <InstancedWindow positions={windowPositions[2]} />
      </mesh>

      {/* Right Side */}
      <mesh
        position={new Vector3(-0.051, -0.005, 0)}
        rotation={new Euler(0, -Math.PI / 2, 0)}
      >
        <InstancedWindow positions={windowPositions[3]} />
      </mesh>
    </mesh>
  );
};

export default BasicHouse;
