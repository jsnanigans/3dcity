export const rndColor = (options: {
  seed?: number;
  lightness?: number;
  saturation?: number;
} = {}): string => {
  const {seed = Math.random(), lightness = Math.random(), saturation = Math.random()} = options;

  // seed is a number between 0 and 1
  // bright is a number between 0 and 1 and controls the brightness of the color
  // return HSL color

  const hue = Math.floor(seed * 360);
  const s = Math.floor(saturation * 100);
  const l = Math.floor(lightness * 100);

  return `hsl(${hue}, ${s}%, ${l}%)`;
};
