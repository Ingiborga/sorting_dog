export class Store{
    constructor(initial = {}) {
    this.state = { ...initial };
    this.listeners = new Set();
  }
  subscribe(fn){
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }
update(patch) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach(fn => fn(this.state));
}
  get() {
    return this.state;
  }
}