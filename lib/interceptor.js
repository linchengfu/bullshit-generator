export class Interceptor {
  constructor() {
    this.aspects = []
  }

  use(functor) {
    this.aspects.push(functor)
    return this
  }

  async run(ctx) {
    const aspects = this.aspects

    const excuse = aspects.reduceRight(function (a, b) {
      return async () => await b(ctx, a)
    }, () => Promise.resolve())

    try {
      await excuse()
    } catch (error) {
      console.log(error.message)
    }

    return ctx
  }
}

const inter = new Interceptor();

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const task = (id) => {
  return async (context, next) => {
    console.log(`task ${id} start`)

    context.count++

    await wait(1000)

    console.log(`count: ${context.count}`)

    await next()

    console.log(`task ${id} end`)
  }
}

// 将多个任务以拦截切面的方式注册到拦截器中
inter.use(task(0));
inter.use(task(1));
inter.use(task(2));
inter.use(task(3));
inter.use(task(4));

// 从外到里依次执行拦截切面
inter.run({ count: 0 });