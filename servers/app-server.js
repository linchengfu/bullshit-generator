import param from "./aspects/param.js";
import {
  InterceptorServer

} from "./interceptor-server.js";
import Router from "./route.js";
import { getCoronavirusKeyIndex, getCoronavirusByDate } from '../lib/module/mock.js'
import handlebars from 'handlebars'
import fs from 'fs'
import url from 'url'
import path from 'path'
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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

  const index = getCoronavirusKeyIndex()
  const filePath = path.resolve(__dirname, './templates/coronavirus_index.html')
  const tpl = fs.readFileSync(filePath, { encoding: 'utf-8' })

  // 编译模板
  const template = handlebars.compile(tpl)

  const result = template({ data: index })

  let cleanedHtml = result.replace(/\r?\n|\r/g, "");


  res.setHeader('Content-Type', 'text/html');
  res.body = cleanedHtml;
  await next();
}));

App.use(router.get('/coronavirus/:date', async ({ route, res }, next) => {
  const data = getCoronavirusByDate(route.date);
  const filePath = path.resolve(__dirname, './templates/coronavirus_data.html')

  const tpl = fs.readFileSync(filePath, { encoding: 'utf-8' })

  const template = handlebars.compile(tpl)

  const result = template({ data })

  res.setHeader('Content-Type', 'text/html');
  res.body = result;

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