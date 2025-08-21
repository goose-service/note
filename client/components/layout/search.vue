<template>
<div class="search">
  <ToggleIcon
    :open="store.openSearch"
    :icons="[ 'x', 'search' ]"
    class="search-toggle"
    @click.stop="onClickToggle">
    <Icon name="search"/>
    <Icon name="x"/>
  </ToggleIcon>
  <form
    :class="[ 'search-form', store.openSearch ? 'on': '' ]"
    @click.stop=""
    @submit.prevent="onSubmit">
    <fieldset>
      <legend>search keyword form</legend>
      <input
        ref="$keyword"
        type="search"
        name="q"
        placeholder="검색어를 입력해주세요."
        maxlength="32"
        :value="props.keyword"
        @input="emits('update:keyword', $event.target.value)"/>
      <button type="submit" title="검색하기">
        <Icon name="search"/>
      </button>
    </fieldset>
  </form>
</div>
</template>

<script setup>
import { ref, watch, nextTick, inject } from 'vue'
import Icon from '../icon/index.vue'
import ToggleIcon from '../button/toggle-icon.vue'

const props = defineProps({
  keyword: String,
})
const emits = defineEmits([ 'update:keyword', 'submit' ])
const store = inject('store')
const $keyword = ref()

watch(() => store.data.openDropdown, async (value) => {
  if (!value) return
  if (value === 'search' || $keyword.value)
  {
    await nextTick()
    $keyword.value.focus()
  }
})

function onClickToggle()
{
  store.changeOpenDropdown('search')
  if (store.openSearch)
  {
    window.addEventListener('click', onCloseBody)
  }
}

function onCloseBody()
{
  store.changeOpenDropdown('')
  window.removeEventListener('click', onCloseBody)
}

function onSubmit()
{
  emits('submit', props.keyword)
  onCloseBody()
}
</script>

<style src="./search.scss" lang="scss" scoped></style>
