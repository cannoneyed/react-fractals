import preact, { h, Component, render } from 'preact';
import { tracked } from '../utils/tracked';

import VizDemo from './VizDemo';

export default class App extends Component {
  async = false;

  @tracked numPoints = 1000;

  updateCount = e => {
    this.numPoints = e.target.value;
  };

  toggleAsync = () => {
    // you can play with these to fit your needs:
    this.async = !this.async;
    preact.options.debounceRendering = requestAnimationFrame;
    // preact.options.debounceRendering = this.async && (f => requestIdleCallback(f, IDLE_TIMEOUT));
    preact.options.syncComponentUpdates = this.async ? false : null;
  };

  render() {
    return (
      <div class="app-wrapper">
        <VizDemo count={this.numPoints} />
        <div class="controls">
          # Points
          <input
            type="range"
            min={10}
            max={10000}
            value={this.numPoints}
            onChange={this.updateCount}
          />
          {this.numPoints}
          <label>
            <input type="checkbox" onChange={this.toggleAsync} />
            Async
          </label>
        </div>
        <div class="about">
          Demo by{' '}
          <a href="https://github.com/developit" target="_blank">
            Jason Miller
          </a>
          , based on the Glimmer demo by{' '}
          <a href="http://mlange.io" target="_blank">
            Michael Lange
          </a>
          .
        </div>
      </div>
    );
  }
}
