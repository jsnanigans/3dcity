import {
  OrbitControls,
  OrthographicCamera,
  PerformanceMonitor,
  Stats,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Scene from "./Scene";

const App = () => {
  const [dpr, setDpr] = useState(1.5);
  return (
    <React.StrictMode>
      <Canvas shadows dpr={[1, 2]} gl={{ alpha: false }}>
        {/* <PerformanceMonitor
          onIncline={() => setDpr(2)}
          onDecline={() => setDpr(1)}
        > */}
          <color attach="background" args={["lightblue"]} />

          {/* Light for shadow */}
          {/* <ambientLight intensity={0.25} /> */}
          {/* <pointLight intensity={1} position={[250, 500, 1000]} />
           */}
          <ambientLight intensity={0.6} />
          {/* shadow everywhere */}
          <directionalLight
            castShadow
            position={[-80, 80, 80]}
            // color={rndColor()}
            intensity={2}
            lookAt={[0, 0, 0]}
            shadow-mapSize-width={1024 * 3}
            shadow-mapSize-height={1024 * 3}
            shadow-camera-left={-40}
            shadow-camera-right={40}
            shadow-camera-top={30}
            shadow-camera-bottom={-40}
            // shadow-camera-near={0.1}
            // shadow-camera-far={1000}
          />

          <OrbitControls
            // limits angle
            // minPolarAngle={Math.PI * 0.2}
            // maxPolarAngle={Math.PI * 0.35}
            // limits distance
            minDistance={10}
            maxDistance={100}
          />

          {/* Camera */}
          <OrthographicCamera
            makeDefault
            zoom={30}
            // top={200}
            // bottom={-200}
            // left={200}
            // right={-200}
            near={1}
            far={1000}
            position={[30, 40, 50]}
          />
          <Scene />
        {/* </PerformanceMonitor> */}
      
        <Stats />
      </Canvas>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
