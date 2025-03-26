export class Route {
  constructor(path, handlers, options = {}) {
    this.handlers = handlers;
    this.children = [];
    this.options = options;
    this.path = path;
  }

  isParent(path) {
    return this.children.some(child => child.path === path);
  }

  findChild(path) {
    return this.children.find(child => child.path === path);
  }

  createChild(path, handlers, options) {
    const child = new Route(path, handlers, options);
    this.children.push(child);

    return child;
  }

  route() {
    // will process handlers
  }
}