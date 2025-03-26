import { Route } from "../src/Route.js";
import buildRouteTree from '../src/lib/buildRouteTree.js';
import { assertThrows, assertEquals, assertFalse } from 'jsr:@std/assert';

Deno.test("buildRouteTree should correctly build a route tree", () => {
  const home = () => console.log("home function");
  const fn1 = () => console.log("First function");
  const fn2 = () => console.log("Second function");

  const baseRoute = new Route("/", [home]);
  const url = "/api/something";

  const updatedRoute = buildRouteTree(baseRoute, url.split("/").filter(Boolean), [fn1, fn2]);

  const apiRoute = updatedRoute.findChild("api");
  const somethingRoute = apiRoute.findChild("something");

  if (!apiRoute || !somethingRoute) {
    throw new Error("Route tree was not built correctly");
  }

  assertFalse(somethingRoute.handlers.length !== 2);
});

Deno.test("buildRouteTree should handle empty URL segments", () => {
  const home = () => console.log("home function");

  const baseRoute = new Route("/", [home]);
  const url = "/";

  const updatedRoute = buildRouteTree(baseRoute, url.split("/").filter(Boolean), []);
  assertFalse(updatedRoute.children.length !== 0);
});

Deno.test("buildRouteTree should handle deeply nested routes", () => {
  const fn1 = () => console.log("First function");

  const baseRoute = new Route("/", []);
  const url = "/api/v1/resource/item";

  const updatedRoute = buildRouteTree(baseRoute, url.split("/").filter(Boolean), [fn1]);

  const apiRoute = updatedRoute.findChild("api");
  const v1Route = apiRoute.findChild("v1");
  const resourceRoute = v1Route.findChild("resource");
  const itemRoute = resourceRoute.findChild("item");

  if (!apiRoute || !v1Route || !resourceRoute || !itemRoute) {
    throw new Error("Deeply nested route tree was not built correctly");
  }

  assertFalse(itemRoute.handlers.length !== 1);
});

Deno.test("buildRouteTree should handle duplicate routes", () => {
  const fn1 = () => console.log("First function");
  const fn2 = () => console.log("Second function");

  const baseRoute = new Route("/", []);
  const url = "/api/resource";

  buildRouteTree(baseRoute, url.split("/").filter(Boolean), [fn1]);
  const updatedRoute = buildRouteTree(baseRoute, url.split("/").filter(Boolean), [fn2]);

  const apiRoute = updatedRoute.findChild("api");
  const resourceRoute = apiRoute.findChild("resource");

  if (!apiRoute || !resourceRoute) {
    throw new Error("Duplicate routes were not handled correctly");
  }

  assertEquals(resourceRoute.handlers.length, 1);
});

Deno.test("buildRouteTree should handle invalid input gracefully", () => {
  const baseRoute = new Route("/", []);

  assertThrows(buildRouteTree(baseRoute, null, []));
  assertThrows(buildRouteTree(baseRoute, undefined, []));
});