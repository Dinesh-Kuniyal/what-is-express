const findRoute = (route, segments, method) => {
  const [segment, ...restSegments] = segments;
  if (!segment) {
    return route.handlers.has(method) ? route : null;
  }

  const isParent = route.isParent(segment);
  if (!isParent) {
    const isWildCard = route.isParent('*');
    if (isWildCard) {
      const wildcardRoute = route.findChild('*');

      return findRoute(wildcardRoute, restSegments, method);
    };

    return null;
  };

  const child = route.findChild(segment);
  return findRoute(child, restSegments, method);
};

export default findRoute;