import {
  InterceptorServer

} from "./interceptor-server.js";
import Router from "./route.js";

const App = new InterceptorServer()

App.use(async ({ res }, next) => {
  res.setHeader('Content-type', 'text/html');
  res.body = '<h1>hello world</h1>'
  await next()

})

const router = new Router();

App.use(router.all('/test/:course/:lecture', async ({ route, res }, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.body = route;
  await next();
}));



App.listen(
  { port: 9000, host: 'localhost' }
)