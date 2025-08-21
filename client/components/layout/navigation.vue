<template>
<div class="navigation">
  <ToggleIcon
    :open="store.openNavigation"
    :icons="[ 'x', 'menu' ]"
    class="navigation-toggle"
    @click.stop="onClickToggle">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
      <path fill="currentColor" fill-rule="nonzero" d="M3 18h18v-2H3v2zm0-5h10v-2H3v2zm0-7v2h14V6H3z"/>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="icon">
      <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  </ToggleIcon>
  <nav
    :class="[ 'navigation-body', store.openNavigation && 'on' ]"
    @click.stop="">
    <ul>
      <li v-for="o in _navigation">
        <a
          :href="o.href"
          :target="o.target"
          :class="{
            'active': route.path !== '/' && route.path.startsWith(o.href),
          }"
          @click.prevent="onClickLink">
          {{o.label}}
        </a>
      </li>
    </ul>
  </nav>
</div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import navigation from '../../../server/resource/navigation.json'
import ToggleIcon from '../button/toggle-icon.vue'

const router = useRouter()
const route = useRoute()
const store = inject('store')

const _navigation = computed(() => {
  return navigation.global.map(o => {
    return {
      label: o.label,
      href: o.href,
      target: /^http/.test(o.href) ? '_blank' : '',
    }
  })
})

function onClickToggle()
{
  store.changeOpenDropdown('navigation')
  if (store.openNavigation)
  {
    window.addEventListener('click', onCloseBody)
  }
}

function onCloseBody()
{
  store.changeOpenDropdown('')
  window.removeEventListener('click', onCloseBody)
}

function onClickLink(e)
{
  e.currentTarget.blur()
  onCloseBody()
  const href = e.currentTarget.getAttribute('href')
  const target = e.currentTarget.getAttribute('target')
  if (!href) return
  if (target) window.open(href, target)
  else router.push(href)
}
</script>

<style src="./navigation.scss" lang="scss" scoped></style>
