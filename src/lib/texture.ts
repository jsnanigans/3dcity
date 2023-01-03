import { CanvasTextureProps } from "@react-three/fiber";
import * as THREE from "three";

const getCanvas = (): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  // return a canvas texture with a road pattern
  const canvas =
    (document.getElementById("canvas") as HTMLCanvasElement) ??
    document.createElement("canvas");
  canvas.id = "canvas";
  return [canvas, canvas.getContext("2d") as CanvasRenderingContext2D];
};

// create road texture
export function streetTexture(): Texture {
  const [canvas, ctx] = getCanvas();
  ctx.clearRect(0, 0, 256, 256);

  canvas.width = 256;
  canvas.height = 256;

  // load texture from image
  const img = new Image();
  img.src = image;
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  texture.needsUpdate = true;

  return texture;
}
