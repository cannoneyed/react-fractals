export const Layout = {
  PHYLLOTAXIS: 0,
  GRID: 1,
  WAVE: 2,
  SPIRAL: 3,
};

export function map(arr, to) {
  let out = [];
  for (let i = arr.length; i--; ) out[i] = to(arr[i]);
  return out;
}

// unused potential memory optimizations:
/*
const mem = {};
const Point = ({ x, y, color }) => {
	let key = `${x},${y},${color}`;
	return key in mem ? mem[key] : (mem[key] =
		<rect
			class="point"
			transform={`translate(${x} ${y})`}
			fill={color}
		/>
	);
};

// an optimized map implementation
//   map(this.points, this.renderPoint, 'points')
let mapCache = {};
export function map(arr, to, id) {
	let out, len=arr.length;
	if (id==null || mapCache[id]==null) out=[];
	else (out = mapCache[id]).length = len;
	for (let i=len; i--; ) out[i] = to(arr[i]);
	if (id!=null) mapCache[id] = out;
	return out;
}
*/

// utilities

const theta = Math.PI * (3 - Math.sqrt(5));

export function xForLayout(layout) {
  switch (layout) {
    case Layout.PHYLLOTAXIS:
      return 'px';
    case Layout.GRID:
      return 'gx';
    case Layout.WAVE:
      return 'wx';
    case Layout.SPIRAL:
      return 'sx';
  }
}

export function yForLayout(layout) {
  switch (layout) {
    case Layout.PHYLLOTAXIS:
      return 'py';
    case Layout.GRID:
      return 'gy';
    case Layout.WAVE:
      return 'wy';
    case Layout.SPIRAL:
      return 'sy';
  }
}

export function lerp(obj, percent, startProp, endProp) {
  let px = obj[startProp];
  return px + (obj[endProp] - px) * percent;
}

export function genPhyllotaxis(n) {
  return i => {
    let r = Math.sqrt(i / n);
    let th = i * theta;
    return [r * Math.cos(th), r * Math.sin(th)];
  };
}

export function genGrid(n) {
  let rowLength = Math.round(Math.sqrt(n));
  return i => [
    -0.8 + (1.6 / rowLength) * (i % rowLength),
    -0.8 + (1.6 / rowLength) * Math.floor(i / rowLength),
  ];
}

export function genWave(n) {
  let xScale = 2 / (n - 1);
  return i => {
    let x = -1 + i * xScale;
    return [x, Math.sin(x * Math.PI * 3) * 0.3];
  };
}

export function genSpiral(n) {
  return i => {
    let t = Math.sqrt(i / (n - 1)),
      phi = t * Math.PI * 10;
    return [t * Math.cos(phi), t * Math.sin(phi)];
  };
}

export function scale(magnitude, vector) {
  return vector.map(p => p * magnitude);
}

export function translate(translation, vector) {
  return vector.map((p, i) => p + translation[i]);
}

export function project(vector) {
  const wh = window.innerHeight / 2;
  const ww = window.innerWidth / 2;
  return translate([ww, wh], scale(Math.min(wh, ww), vector));
}
