
class Interceptor {
  use(functor) {
    this.aspects.push(functor)
    return this
  }
  constructor() {
    this.aspects = []
  }

  async run(context) {
    const aspects = this.aspects;
    const proc = aspects.reduceRight((a, b) => {
      return async () => { await b(context, a) }
    }, () => Promise.resolve())

    try {
      await proc()
    } catch (error) {
      console.log('error: ', error)
    }

    return context
  }

}

export default Interceptor