const findRoute = (route, segments, method) => {
  const [segment, ...restSegments] = segments;

  if (!segment) {
    return isMethodSupported(route, method) ? route : null;
  }

  if (!route.isParent(segment)) {
    return handleNonParentRoute(route, segment, restSegments, method);
  }

  const child = route.findChild(segment);
  return findRoute(child, restSegments, method);
};

const isMethodSupported = (route, method) => {
  return route.handlers.has(method);
};

const handleNonParentRoute = (route, segment, restSegments, method) => {
  const dynamicChild = route.dynamicChild();
  const wildcardRoute = route.findChild('*');
  const isLast = restSegments.length === 0;

  if (wildcardRoute && isLast) {
    return findRoute(wildcardRoute, restSegments, method);
  }

  if (dynamicChild) {
    return handleDynamicChild(dynamicChild, segment, restSegments, method);
  }

  if (wildcardRoute) {
    return findRoute(wildcardRoute, restSegments, method);
  }

  return null;
};

const handleDynamicChild = (dynamicChild, segment, restSegments, method) => {
  const dynamicRoute = findRoute(dynamicChild, restSegments, method);
  if (dynamicRoute) {
    dynamicRoute.urlData = {
      ...dynamicRoute?.urlData,
      [dynamicChild.path.slice(1)]: segment
    };
  }
  return dynamicRoute;
};

export default findRoute;