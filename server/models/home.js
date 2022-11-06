import { instance } from './index.js'
import { getEnv } from '../libs/entry-assets.js'
import { ERROR_CODE } from '../libs/assets.js'

function filteringArticles({ src, host })
{
  return src.map(o => {
    return {
      srl: o.srl,
      title: o.title,
      date: o.order,
      image: o.json?.thumbnail?.path ? `${host}/${o.json.thumbnail.path}` : null,
      nest: o.nest_name || null,
      category: o.category_name || null,
    }
  })
}

export async function modelHome({ page, q })
{
  let result = {
    total: 0,
    items: [],
  }
  const env = getEnv()
  const size = Number(env.VITE_INDEX_SIZE || 24)
  const baseQuery = {
    app: env.VITE_APP_SRL,
    field: 'srl,nest_srl,category_srl,title,`order`,json',
    ext_field: 'category_name,nest_name',
  }
  // get articles and random articles
  let items = await instance('/articles/', {
    query: {
      ...baseQuery,
      order: '`order` desc, `srl` desc',
      limit: `${(page-1)*size},${size}`,
      q: q ? decodeURIComponent(q) : undefined,
    },
  })
  // filtering articles
  if (items?.success)
  {
    result.total = items.data?.total || 0
    result.items = items.data?.index.length > 0 ? filteringArticles({
      src: items.data.index,
      host: env.VITE_API_URL,
    }) : []
  }
  else
  {
    throw {
      status: ERROR_CODE.NOT_FOUND,
      message: 'not found item',
    }
  }
  // return
  return result
}
