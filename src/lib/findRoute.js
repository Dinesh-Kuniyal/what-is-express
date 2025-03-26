const findRoute = (route, segments, method) => {
  const [segment, ...restSegments] = segments;
  // console.log(segment, route);

  if (!segment) {
    return route.handlers.has(method) ? route : null;
  }

  const isParent = route.isParent(segment);
  const isLast = restSegments.length === 0;
  if (!isParent) {
    const dynamicChild = route.dynamicChild();
    const wildcardRoute = route.findChild('*');

    if (dynamicChild && isLast)
      return findRoute(wildcardRoute, restSegments, method);

    if (dynamicChild) {
      const dynamicRoute = findRoute(dynamicChild, restSegments, method);
      dynamicRoute.urlData = {
        ...dynamicRoute.urlData,
        [dynamicChild.path.slice(1)]: segment
      };

      return dynamicRoute;
    }

    if (wildcardRoute)
      return findRoute(wildcardRoute, restSegments, method);

    return null;
  };

  const child = route.findChild(segment);
  return findRoute(child, restSegments, method);
};

export default findRoute;