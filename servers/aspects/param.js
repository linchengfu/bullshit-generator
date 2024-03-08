import url from 'url'
import queryString from 'querystring'

export default async function (ctx, next) {
  const { req } = ctx;

  const { query } = url.parse(`http://${req.headers.host}${req.url}`)

  ctx.params = queryString.parse(query)

  await next()
}