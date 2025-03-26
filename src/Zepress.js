import { Route } from "./Route.js";
import buildRouteTree from "./lib/buildRouteTree.js";
import findRoute from "./lib/findRoute.js";

class ZepressServer {
  constructor(port = 5050) {
    this.port = port;
    this.routeTree = new Route('/');
  }

  routesHandler(request) {
    const { method, url } = request;
    const { pathname } = new URL(url);
    const segments = pathname === "/" ? pathname : pathname.split('/').filter(Boolean);

    const matchedRoute = findRoute(this.routeTree, segments, method);

    if (!matchedRoute)
      return new Response('Route not found', { status: 404 });

    return matchedRoute.process(request, method);
  }

  registerRequest(method, path, ...controllers) {
    const segments = path === "/" ? [path] : path.split('/').filter(Boolean);

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