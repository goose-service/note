import { instance } from './index.js'
import { getEnv } from '../libs/entry-assets.js'
import { ERROR_CODE } from '../libs/assets.js'
import { dateFormat } from '../libs/date.js'

/**
 * model article
 *
 * @param {number} srl
 * @param {boolean} updateHit
 * @return {Promise<object>}
 */
export async function modelArticle({ srl, updateHit })
{
  if (!(srl > 0))
  {
    throw {
      status: ERROR_CODE.NOT_FOUND,
      message: 'no srl',
    }
  }
  let result = {
    srl: 0,
    title: '',
    nestName: '',
    categoryName: '',
    content: '',
    image: '',
    hit: '',
    star: 0,
    comments: [],
  }
  const env = getEnv()
  const host = env.VITE_API_URL
  const article = await instance(`/articles/${srl}/`, {
    query: {
      app: env.VITE_APP_SRL,
      hit: updateHit ? 1 : 0,
      ext_field: 'nest_name,category_name',
    },
  })
  if (!(article.success && article.data?.srl))
  {
    throw {
      status: ERROR_CODE.NOT_FOUND,
      message: 'not found item',
    }
  }
  const nest = await instance(`/nests/${article.data.nest_srl}/`, {
    field: 'srl,json'
  })
  result.srl = article.data.srl
  result.title = article.data.title
  result.nestName = article.data.nest_name
  result.categoryName = article.data.category_name
  result.content = article.data.content
  result.image = article.data.json?.thumbnail?.path ? `${host}/${article.data.json.thumbnail.path}` : null
  result.date = article.data.order
  result.hit = article.data.hit
  result.star = article.data.star
  // get comments
  if (Number(nest.data.json?.useComment) === 1)
  {
    const comments = await instance(`/comments/`, {
      query: { article: article.data.srl },
    })
    if (comments.data?.index?.length > 0)
    {
      result.comments = comments.data.index.map((item) => ({
        srl: item.srl,
        content: item.content,
        date: dateFormat(new Date(item.regdate), '{yyyy}-{MM}-{dd}')
      }))
    }
  }
  return result
}

/**
 * update star
 *
 * @param {number} srl
 * @return {Promise<number>}
 */
export async function modelArticleUpdateStar({ srl })
{
  let res = await instance(`/articles/${srl}/update/`, {
    method: 'post',
    body: { type: 'star' },
  })
  if (!res.success)
  {
    throw {
      status: ERROR_CODE.FAILED_UPDATE,
      message: 'Failed update star.',
    }
  }
  return Number(res.data.star)
}
