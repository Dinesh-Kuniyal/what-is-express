import { Route } from "./Route.js";
import buildRouteTree from "./lib/buildRouteTree.js";

class ZepressServer {
  constructor(port = 5050) {
    this.port = port;
    this.routeTree = new Route('/');
  }

  routesHandler(request) {
    const { method, url } = request;
    const { pathname } = new URL(url);

    const controllersList = this.routeTree.get(pathname);
    if (!controllersList || !(method in controllersList)) {
      return new Response('Route not found', { status: 404 });
    }

    const middlewaresAndControllers = controllersList[method];
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

  registerRequest(method, path, ...controllers) {
    const segments = path.split('/').filter(Boolean);

    this.routeTree = buildRouteTree(this.routeTree, segments, controllers, method);
  }

  start() {
    Deno.serve({ port: this.port }, this.routesHandler.bind(this));
  }
}

const zepress = (port = 5050) => {
  const server = new ZepressServer(port);

  return {
    get: (route, ...controllers) => server.registerRequest('GET', route, ...controllers),
    post: (route, ...controllers) => server.registerRequest('POST', route, ...controllers),
    routes: server.routeTree,
    start: server.start.bind(server),
  };
};

export default zepress;