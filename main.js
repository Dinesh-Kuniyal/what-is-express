import { Route } from "./src/Route.js";

const fn1 = () => console.log('First function');
const fn2 = () => console.log('Second function');
const fn3 = () => console.log('Thord function');
const fn4 = () => console.log('Fourth function');

const home = () => console.log('home function');

const lookup = (route, segments, handlers) => {
  if (!segments.length) return;

  const [segment, ...restSegments] = segments;
  const isLastSegment = restSegments.length === 0;

  console.log(segment, route.path, route.isParent(segment));

  const child = route.isParent(segment)
    ? route.findChild(segment)
    : route.createChild(segment, isLastSegment ? handlers : []);

  if (isLastSegment) {
    child.handlers = handlers;
    return;
  }

  return lookup(child, restSegments, handlers);
};

const main = () => {
  const url = '/api/something';
  const url2 = '/todo';
  const url33= '/api/something/1/2';

  const baseRoute = new Route('/', [home]);

  lookup(baseRoute, url.split('/').filter(Boolean), [fn1, fn2]);
  lookup(baseRoute, url2.split('/').filter(Boolean), [fn3, fn4]);
  lookup(baseRoute, url33.split('/').filter(Boolean), [fn3, fn4]);

  console.dir(baseRoute, {
    depth: null
  });
};

main();