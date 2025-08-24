import ServiceError from '../../classes/ServiceError.js'
import { onRequest, onResponse } from '../../libs/server.js'
import { requestApi, apiAssets } from '../../libs/api.js'
import { getQuery } from '../../libs/util.js'
import { catchResponse, filteringArticle } from './_libs.js'

/**
 * home
 * 첫페이지에서 사용되는 article 목록 가져오기
 *
 * @return {Promise<Response>}
 */
async function apiHome(req, _ctx = undefined)
{
  let response

  // trigger request event
  if (_ctx) onRequest(req, _ctx)

  try
  {
    const query = getQuery(req.url)
    const page = Number(query.page || 1)
    const res = await requestApi('/article/', {
      query: {
        app: apiAssets.appSrl,
        fields: apiAssets.articleIndexFields,
        mod: 'nest,category',
        mode: 'public',
        size: apiAssets.size,
        order: 'regdate',
        sort: 'desc',
        q: query.q || '',
        page,
      },
    })
    if (!(res?.data?.index?.length > 0))
    {
      throw new ServiceError('Not found article.', {
        status: 204,
      })
    }
    // set response
    response = Response.json({
      message: 'Complete get home data.',
      total: res.data.total,
      index: res.data.index.map(filteringArticle),
      assets: {
        page,
        size: apiAssets.size,
      },
    })
  }
  catch (e)
  {
    response = catchResponse(e)
  }

  // trigger response event
  if (_ctx) onResponse(req, response, _ctx)

  // return response
  return response
}

export default apiHome
