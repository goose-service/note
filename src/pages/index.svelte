{#if loading}
  <Loading full={true} move={true}/>
{:else}
  <article class="index">
    <header class="index__header">
      <h1>{_title}</h1>
    </header>
    {#if categories?.length > 0}
      <div class="index__categories">
        .categories
      </div>
    {/if}
    <div class="index__body">
      {#if articles?.length > 0}
        <div class="index__items">
          <Items>
            {#each articles as o, key}
              <Item
                srl={o.srl}
                title={o.title}
                image={o.image}
                date={o.date}
                nest="nest"
                category="category"/>
            {/each}
          </Items>
        </div>
      {:else}
        <div class="index__empty">
          <Error status={204} message="no articles"/>
        </div>
      {/if}
      {#if totalArticles > 0}
        <div class="index__paginate">
          <Paginate
            page={route.query.page}
            total={totalArticles}
            size={size}
            url="./"
            query={router.location.query.get()}/>
        </div>
      {/if}
    </div>
  </article>
{/if}

<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { router } from 'tinro'
import { $fetch as fetch } from 'ohmyfetch'
import Error from '../components/error.svelte'
import Items from '../components/pages/index/items.svelte'
import Item from '../components/pages/index/item.svelte'
import Loading from '../components/loading/loading-page.svelte'
import Paginate from '../components/paginate.svelte'

export let route: Route
let currentRoute
let loading: boolean = false
let nest: Nest = undefined
let categories: Category[] = []
let totalArticles: number = 0
let articles: Article[] = []
let size = Number(import.meta.env.VITE_INDEX_SIZE)

$: if (!route.params?.nest) updateIndex()
$: if (currentRoute?.params?.nest !== route.params?.nest) updateNest()

$: _categories = categories.map(o => {
  return {
    srl: o.srl ? String(o.srl) : '',
    label: o.name,
    count: o.count_article,
    link: o.srl ? `/nest/${currentRoute.params?.nest}/${o.srl}/` : `/nest/${currentRoute.params?.nest}/`,
  }
})
$: _title = 'Newest articles'

async function updateIndex(): Promise<void>
{
  try
  {
    currentRoute = route
    loading = true
    let query: Query = {}
    if (Number(route.query?.page) > 1)
    {
      query.page = Number(route.query?.page)
    }
    let res: ResponseIndex = await fetch(`/api/`, {
      responseType: 'json',
      query,
    })
    nest = undefined
    categories = []
    totalArticles = res.total || 0
    articles = res.items?.length > 0 ? res.items : []
    loading = false
  }
  catch (e)
  {
    loading = false
  }
}

async function updateNest(): Promise<void>
{
  try
  {
    currentRoute = route
    loading = true
  }
  catch (e)
  {
    loading = false
  }
  console.log('updateNest()')
}
</script>

<style src="./index.scss" lang="scss"></style>
