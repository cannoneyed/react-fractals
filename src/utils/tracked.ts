export function tracked<T>(obj: any, key: keyof T) {
  let setter: { [key: string]: any } = {};
  function initialize() {
    Object.defineProperty(this, key, {
      configurable: true,
      get: () => this.state[key],
      set: v => {
        setter[key as string] = v;
        this.setState(setter);
      },
    });
    return this.state[key];
  }
  Object.defineProperty(obj, key, {
    configurable: true,
    set(v) {
      initialize.call(this);
      this[key] = v;
    },
    get: initialize,
  });
}
