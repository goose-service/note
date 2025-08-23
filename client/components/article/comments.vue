<template>
<article class="comments">
  <h1>{{props.total}}개의 댓글</h1>
  <ul>
    <li
      v-for="o in props.index"
      :id="`c${o.srl}`"
      class="comment">
      <ContentBody
        :content="o.content"
        @click:image="onClickImage"/>
      <div class="meta">
        <em>Written on {{o.date}}</em>
        <a :href="`#c${o.srl}`" draggable="false">
          <Icon name="link"/>
        </a>
      </div>
    </li>
  </ul>
</article>
</template>

<script setup>
import Icon from '../icon/index.vue'
import ContentBody from './content-body.vue'

const props = defineProps({
  total: Number,
  index: Array,
})
const emits = defineEmits([ 'open:image' ])

function onClickImage(e)
{
  emits('open:image', e)
}
</script>

<style src="./comments.scss" lang="scss" scoped></style>
