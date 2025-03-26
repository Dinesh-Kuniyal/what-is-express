export class Route {
  constructor(path, handlers, options = {}) {
    this.handlers = handlers;
    this.childrens = [];
    this.options = options;
    this.path = path;
  }

  isParent(path) {
    return this.childrens.some(child => child.path === path);
  }

  findChild(path) {
    return this.childrens.find(child => child.path === path);
  }

  createChild(path, handlers, options) {
    const child = new Route(path, handlers, options);
    this.childrens.push(child);

    return child;
  }

  route() {
    // will process handlers
  }
}