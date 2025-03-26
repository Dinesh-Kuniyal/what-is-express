const buildRouteTree = (route, segments = [], handlers = []) => {
  if (!segments || !segments.length) return route;

  const [segment, ...restSegments] = segments;
  const isLastSegment = restSegments.length === 0;

  const child = route.isParent(segment)
    ? route.findChild(segment)
    : route.createChild(segment, isLastSegment ? handlers : []);

  if (isLastSegment) {
    child.handlers = handlers;
    return route;
  }

  buildRouteTree(child, restSegments, handlers);
  return route;
};

export default buildRouteTree;