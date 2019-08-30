import { h, Component } from 'preact';
import { interpolateViridis } from 'd3-scale-chromatic';
import { tracked } from '../utils/tracked';
import {
  Layout,
  genPhyllotaxis,
  genGrid,
  genWave,
  genSpiral,
  xForLayout,
  yForLayout,
  lerp,
  project,
  map,
} from '../utils/calc';

import Point from './Point';

const LAYOUT_ORDER = [
  Layout.PHYLLOTAXIS,
  Layout.SPIRAL,
  Layout.PHYLLOTAXIS,
  Layout.GRID,
  Layout.WAVE,
];

export interface VizDemoProps {
  count: number;
}

export default class VizDemo extends Component<VizDemoProps> {
  @tracked layout = 0;
  @tracked count = 100;
  @tracked phyllotaxis = genPhyllotaxis(100);
  @tracked grid = genGrid(100);
  @tracked wave = genWave(100);
  @tracked spiral = genSpiral(100);

  @tracked points = [];

  @tracked step = 0;
  @tracked numSteps = 60 * 2;

  next = () => {
    requestAnimationFrame(this.next);

    this.step = (this.step + 1) % this.numSteps;

    if (this.step === 0) {
      this.layout = (this.layout + 1) % LAYOUT_ORDER.length;
    }

    // Clamp the linear interpolation at 80% for a pause at each finished layout state
    const pct = Math.min(1, this.step / (this.numSteps * 0.8));

    const currentLayout = LAYOUT_ORDER[this.layout];
    const nextLayout = LAYOUT_ORDER[(this.layout + 1) % LAYOUT_ORDER.length];

    // Keep these redundant computations out of the loop
    const pxProp = xForLayout(currentLayout);
    const nxProp = xForLayout(nextLayout);
    const pyProp = yForLayout(currentLayout);
    const nyProp = yForLayout(nextLayout);

    for (let i = this.points.length; i--; ) {
      // let p = Object.assign({}, this.points[i]);
      let p = this.points[i];
      p.x = lerp(p, pct, pxProp, nxProp);
      p.y = lerp(p, pct, pyProp, nyProp);
      this.points[i] = p;
    }
  };

  makePoints() {
    const newPoints = [];
    for (var i = 0; i < this.count; i++) {
      newPoints.push({
        x: 0,
        y: 0,
        color: interpolateViridis(i / this.count),
        $point0: null,
        $point1: null,
      });
    }
    this.points = newPoints;
    this.setAnchors();
  }

  setAnchors() {
    this.points.forEach((p, index) => {
      const [gx, gy] = project(this.grid(index));
      const [wx, wy] = project(this.wave(index));
      const [sx, sy] = project(this.spiral(index));
      const [px, py] = project(this.phyllotaxis(index));
      Object.assign(p, { gx, gy, wx, wy, sx, sy, px, py });
    });
  }

  componentDidUpdate() {
    if (this.props.count !== this.count) {
      this.count = this.props.count;

      this.phyllotaxis = genPhyllotaxis(this.count);
      this.grid = genGrid(this.count);
      this.wave = genWave(this.count);
      this.spiral = genSpiral(this.count);

      this.makePoints();
    }
  }

  componentDidMount() {
    this.next();
  }

  renderPoint = point => {
    // a/b swap
    let prop = '$point' + (this.step % 2);
    let p = point[prop];
    if (p) {
      Object.assign(p.attributes, point);
      return p;
    }
    return (point[prop] = <Point {...point} />);
  };

  render() {
    return (
      <svg class="demo">
        <g>{map(this.points, this.renderPoint)}</g>
      </svg>
    );
  }
}
