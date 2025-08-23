<template>
<article class="article">
  <Loading v-if="state.loading"/>
  <template v-else-if="state.article">
    <header class="article-header">
      <h1>{{_title}}</h1>
      <p>
        <span v-for="o in _description">{{o}}</span>
      </p>
    </header>
    <div class="article-body">
      <ContentBody
        :content="state.article.content"
        @click:image="onClickImage"/>
    </div>
    <nav class="article-star">
      <StarButton
        :count="state.article.star.count"
        :disabled="state.article.star.disabled"
        @click:button="onClickStar"/>
    </nav>
    <Comments
      v-if="state.comment"
      :total="state.comment.total"
      :index="state.comment.index"
      class="article-comment"
      @open:image="onClickImage"/>
  </template>
  <Error
    v-else
    page-title="No Content"
    :error="new ServiceError('No Content', 204)"
    class="article-empty"/>
  <teleport to="#modal">
    <Lightbox
      :src="state.lightbox?.src"
      :src-dark="state.lightbox?.srcDark"
      :alt="state.lightbox?.alt"
      @close="onCloseLightbox"/>
  </teleport>
</article>
</template>

<script setup>
import { reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ofetch } from 'ofetch'
import ServiceError from '../../libs/error.js'
import { hashScroll } from '../../libs/util.js'
import { dateFormat } from '../../libs/strings.js'
import Loading from '../../components/etc/loading.vue'
import Error from '../../components/content/error.vue'
import ContentBody from '../../components/article/content-body.vue'
import StarButton from '../../components/article/star-button.vue'
import Comments from '../../components/article/comments.vue'
import Lightbox from '../../components/article/lightbox.vue'

const router = useRouter()
const route = useRoute()
const state = reactive({
  loading: true,
  article: null,
  comment: null,
  lightbox: null, // { src, srcDark, alt }
})

const _title = computed(() => {
  if (state.article?.title === '.') return 'Untitled Work'
  return state.article?.title || ''
})
const _description = computed(() => {
  return [
    ...state.article?.description,
    dateFormat(new Date(state.article?.regdate), '{yyyy}-{MM}-{dd}'),
  ]
})

onMounted(async () => {
  try
  {
    state.loading = true
    const res = await ofetch(`/api/article/${route.params.srl}/`)
    if (!res) throw new ServiceError('No Content', 204)
    state.article = {
      srl: res.srl,
      title: res.title,
      description: [ res.nestName, res.categoryName ],
      content: res.content,
      regdate: res.regdate,
      star: {
        count: res.star,
        disabled: res.usedUpStar,
      },
    }
    state.comment = res.comment
    // scroll to hash content
    if (location.hash)
    {
      await nextTick()
      hashScroll(location.hash)
    }
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
})

function onClickImage({ src, srcDark, alt })
{
  state.lightbox = { src, srcDark, alt }
}

function onCloseLightbox()
{
  state.lightbox = null
}

async function onClickStar()
{
  if (!state.article?.star) return
  try
  {
    const res = await ofetch(`/api/article/${route.params.srl}/star/`, {
      method: 'post',
    })
    state.article.star.disabled = true
    state.article.star.count = res.count
  }
  catch (_e)
  {
    alert('Failed update star.')
  }
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
