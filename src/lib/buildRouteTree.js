const buildRouteTree =
  (route, segments = [], handlers = new Map(), method = 'GET') => {
    if (!segments || !segments.length) return route;

    const [segment, ...restSegments] = segments;
    const isLastSegment = restSegments.length === 0;

    const child = route.isParent(segment)
      ? route.findChild(segment)
      : route.createChild(segment, isLastSegment ? new Map([[method, handlers]]) : new Map());

    if (isLastSegment) {
      child.handlers.set(method, handlers);
      return route;
    }

    buildRouteTree(child, restSegments, handlers, method);
    return route;
  };

export default buildRouteTree;