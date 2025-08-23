<template>
<article class="index">
  <Loading v-if="state.loading"/>
  <div v-else class="body">
    <header v-if="_title" class="index-header">
      <h1>{{_title}}</h1>
    </header>
    <nav v-if="state.category?.length > 0" class="index-category">
      <Category
        :nest="route.params.nest"
        :items="state.category"
        :active="route.params.category"/>
    </nav>
    <div class="index-body">
      <Loading v-if="state.articleLoading"/>
      <ul v-else-if="state.article?.length > 0">
        <li v-for="o in state.article">
          <Item
            :srl="o.srl"
            :title="o.title"
            :image="o.image"
            :description="`${o.nest} / ${o.category}`"/>
        </li>
      </ul>
      <Error
        v-else
        page-title="No Content"
        :error="new ServiceError('No Content', 204)"
        class="empty"/>
    </div>
    <div v-if="state.total > 0" class="index-paginate">
      <Paginate
        :page="route.query.page"
        :total="state.total"
        :size="state.assets.size"
        :range="3"
        class="paginate--mobile"
        @update:page="onChangePage"/>
      <Paginate
        :page="route.query.page"
        :total="state.total"
        :size="state.assets.size"
        :range="10"
        class="paginate--desktop"
        @update:page="onChangePage"/>
    </div>
  </div>
</article>
</template>

<script setup>
import { reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ofetch } from 'ofetch'
import ServiceError from '../../libs/error.js'
import { serialize } from '../../libs/strings.js'
import { scrollTo } from '../../libs/util.js'
import Error from '../../components/content/error.vue'
import Category from '../../components/content/category.vue'
import Item from '../../components/content/item.vue'
import Loading from '../../components/etc/loading.vue'
import Paginate from '../../components/etc/paginate.vue'

const router = useRouter()
const route = useRoute()
const state = reactive({
  loading: true,
  articleLoading: false,
  total: 0,
  nest: null,
  category: [],
  article: [],
  assets: { size: 24 },
})

const _title = computed(() => {
  if (state.nest?.name)
  {
    return state.nest?.name
  }
  else if (state.nest)
  {
    return 'Unknown Nest'
  }
  else if (route.query?.q)
  {
    return `S:/ ${route.query.q}`
  }
  else
  {
    return state.article?.length > 0 ? 'Newest Articles' : ''
  }
})

onMounted(_fetch)
watch(() => [ route.params, route.query.page, route.query.q ], (value, oldValue) => {
  const [ params, page, keyword ] = value
  const [ oldParams, oldPage, oldKeyword ] = oldValue
  if (keyword !== oldKeyword)
  {
    state.total = 0
    state.nest = null
    state.category = []
    state.article = []
    _fetch().then()
  }
  else if (params.nest !== oldParams.nest)
  {
    _fetch().then()
  }
  else if (params.category !== oldParams.category)
  {
    _fetchArticle().then()
  }
  else if (page !== oldPage)
  {
    _fetchArticle().then()
  }
})

async function _fetch()
{
  try
  {
    state.loading = true
    let _url = '/api/'
    if (route.params.nest)
    {
      _url += `nest/${route.params.nest}/`
      if (route.params.category) _url += `${route.params.category}/`
    }
    const res = await ofetch(_url, { query: route.query })
    if (!res) throw new ServiceError('No Content', 204)
    state.nest = res.nest || null
    state.category = res.category?.length > 0 ? res.category : []
    if (res.article)
    {
      if (res.article?.total) state.total = res.article.total
      if (res.article?.index?.length > 0) state.article = res.article.index
    }
    else
    {
      state.total = res.total || 0
      state.article = res.index?.length > 0 ? res.index : []
    }
    if (res.assets) state.assets.size = res.assets.size
  }
  catch (_e)
  {
    if (_e instanceof ServiceError)
    {
      if (_e.code !== 204) throw _e
    }
    else
    {
      throw new ServiceError(_e?.message)
    }
  }
  finally
  {
    state.loading = false
  }
}

async function _fetchArticle()
{
  if (state.loading) return
  try
  {
    scrollTo(0)
    state.articleLoading = true
    let _query = {}
    if (state.nest?.srl) _query.nest = state.nest.srl
    if (route.params.category) _query.category = route.params.category
    if (route.query.page > 1) _query.page = Number(route.query.page)
    const res = await ofetch(`/api/article/`, { query: _query })
    if (!res) throw new ServiceError('No Content', 204)
    state.total = res.total || 0
    state.article = res.index
  }
  catch (_e)
  {
    if (_e instanceof ServiceError)
    {
      if (_e.code === 204)
      {
        state.total = 0
        state.article = []
      }
      else
      {
        throw _e
      }
    }
    else
    {
      throw new ServiceError(_e?.message)
    }
  }
  finally
  {
    state.articleLoading = false
  }
}

function onChangePage(page)
{
  let _query = { ...route.query }
  _query.page = page > 1 ? page : NaN
  router.push(`./${serialize(_query, true)}`).then()
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
