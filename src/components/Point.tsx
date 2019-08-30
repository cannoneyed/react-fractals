import { h, Component } from 'preact';

export interface PointProps {
  x: number;
  y: number;
  color: string;
}

export default class Point extends Component<PointProps> {
  render({ x, y, color }) {
    return (
      <rect class="point" transform={`translate(${x}, ${y})`} fill={color} />
    );
  }
}
