export class Route {
  constructor(path, handlers = new Map(), options = {}) {
    this.handlers = handlers;
    this.children = [];
    this.options = options;
    this.path = path;
    if (path.startsWith(":")) {
      this.options.isDynamic = true;
    }
  }

  isParent(path) {
    return this.children.some(child => child.path === path);
  }

  findChild(path) {
    return this.children.find(child => child.path === path);
  }

  dynamicChild() {
    return this.children.find(({ path }) => path.startsWith(':'));
  }

  createChild(path, handlers, options) {
    const child = new Route(path, handlers, options);
    this.children.push(child);

    return child;
  }

  process(request, method, route) {
    request.urlData = route?.urlData;

    const middlewaresAndControllers = this.handlers.get(method);
    console.log(middlewaresAndControllers);

    let index = 0;

    const next = () => {
      const currentHandler = middlewaresAndControllers[index];
      if (index === middlewaresAndControllers.length - 1) {
        return currentHandler(request);
      }

      index++;
      return currentHandler(request, next);
    };

    return next();
  }
}