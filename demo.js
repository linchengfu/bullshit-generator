import Interceptor from "./interceptor.js"

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(
      resolve, ms)
  })
}

const inter = new Interceptor()


const task = (id) => {
  return async (ctx, next) => {
    console.log(`task ${id} started`)

    ctx.count++
    await wait(1000)
    console.log(`count: ${ctx.count}`);

    await next()
    console.log(`task ${id} ended`)
  }
}
// 将多个任务以拦截切面的方式注册到拦截器中
inter.use(task(0));
inter.use(task(1));
inter.use(task(2));
inter.use(task(3));
inter.use(task(4));

inter.run({ count: 0 })