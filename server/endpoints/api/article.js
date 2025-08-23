import ServiceCookie from '../../classes/ServiceCookie.js'
import ServiceError from '../../classes/ServiceError.js'
import { onRequest, onResponse } from '../../libs/server.js'
import { requestApi } from '../../libs/api.js'
import { catchResponse, makeThumbnailPath, parsingContent, getCookieKey, filteringComment } from './_libs.js'

/**
 * article
 * article 데이터 가져오기
 *
 * @return {Promise<Response>}
 */
async function apiArticle(req, _ctx = undefined)
{
  let response

  // trigger request event
  if (_ctx) onRequest(req, _ctx)

  try
  {
    // check srl
    const { srl } = req.params
    if (!(Number(srl) > 0))
    {
      throw new ServiceError('Not found srl.', {
        status: 204,
      })
    }
    // cookie
    const cookie = new ServiceCookie(req)
    const cookieHitKey = getCookieKey('hit', srl)
    const cookieStarKey = getCookieKey('star', srl)

    // get article data
    const { article, nest, category, comment } = await requestApi(`/mix/`, {
      method: 'post',
      json: [
        {
          key: 'article',
          url: '/article/{srl}/',
          params: {
            srl,
            mod: cookie.existValue(cookieHitKey) ? '' : 'up-hit',
          },
        },
        {
          key: 'nest',
          url: '/nest/{srl}/',
          params: {
            srl: '{{article.data.nest_srl}}',
            fields: 'srl,name',
          },
        },
        {
          key: 'category',
          url: '/category/{srl}/',
          params: {
            srl: '{{article.data.category_srl}}',
            fields: 'srl,name',
          },
        },
        {
          key: 'comment',
          url: '/comment/',
          params: {
            module: 'article',
            module_srl: '{{article.data.srl}}',
            unlimited: '1',
          },
        },
      ],
    })
    // check response
    if (!article?.data)
    {
      throw new ServiceError('Not found data.', {
        status: 204,
      })
    }
    // update cookie
    cookie.setValue(cookieHitKey, 1)
    // set response
    response = Response.json({
      message: 'Complete get article data.',
      srl: article.data.srl,
      title: article.data.title,
      nestName: nest?.data?.name,
      categoryName: category?.data?.name,
      content: parsingContent(article.data.content),
      image: makeThumbnailPath(article.data.json?.thumbnail),
      hit: article.data.hit,
      star: article.data.star,
      regdate: article.data.created_at,
      usedUpStar: cookie.existValue(cookieStarKey),
      comment: comment.data ? {
        total: comment.data.total,
        index: comment.data.index?.length > 0 ? comment.data.index.map(filteringComment) : [],
      } : null,
    })
  }
  catch (e)
  {
    response = catchResponse(e)
  }

  // trigger response event
  if (_ctx) onResponse(req, response, _ctx)

  return response
}

export default apiArticle
