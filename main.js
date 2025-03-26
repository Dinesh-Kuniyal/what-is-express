import zepress from "./src/Zepress.js";

const app = zepress(9000);

const homeController = () => new Response('Hello from home route');

const aboutGetController = () => new Response('Hello from about get route');

const aboutTestPostController = () => new Response('Hello from about test post controller');

const aboutMiddleware = (_, next) => {
  console.log('Hello from middleware');

  return next();
};

const aboutSecondMiddleware = (_, next) => {
  console.log('Second middleware');

  return next();
};

app.get('/', homeController);
app.get('/about', aboutMiddleware, aboutSecondMiddleware, aboutGetController);
app.post('/about/test', aboutTestPostController);

console.dir(app.routes, { depth: null });

app.start();