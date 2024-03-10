import param from "./aspects/param.js";
import {
  InterceptorServer

} from "./interceptor-server.js";
import Router from "./route.js";
import { getCoronavirusKeyIndex } from '../lib/module/mock.js'

const router = new Router();


const App = new InterceptorServer()

App.use((ctx, next) => {
  const { req } = ctx
  console.log(`${req.method}, ${req.url}`)
  next()
})

App.use(param)



// App.use(async ({ res }, next) => {
//   res.setHeader('Content-type', 'text/html');
//   res.body = '<h1>hello world</h1>'
//   await next()

// })

App.use(router.get('/coronavirus/index', async ({ route, res }, next) => {
  console.log('index')
  const index = await getCoronavirusKeyIndex()


  res.setHeader('Content-Type', 'application/json');
  res.body = { data: index };
  await next();
}));

App.use(router.get('/coronavirus/:date', async ({ route, res }, next) => {
  const { getCoronavirusByDate } = await import('../lib/module/mock.js');
  const data = getCoronavirusByDate(route.date);
  res.setHeader('Content-Type', 'application/json');
  res.body = { data };
  await next();
}));



App.use(router.all('/test/:course/:lecture', async ({ route, res }, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.body = route;
  await next();
}));



App.listen(
  { port: 9000, host: 'localhost' }
)