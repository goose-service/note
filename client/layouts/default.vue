<template>
<div class="layout">
  <header class="layout-header">
    <div class="wrap">
      <h1 class="logo">
        <router-link :to="navigation.home.href">
          <img
            src="/images/ico-logo.webp"
            width="229"
            height="196"
            :alt="navigation.home.label"/>
        </router-link>
      </h1>
      <Navigation class="navigation"/>
      <nav class="dark-mode-switch">
        <goose-dark-mode-switch :theme="store.data.theme" @change="onChangeTheme"/>
      </nav>
      <Search
        v-model:keyword="state.search"
        class="search"
        @submit="onSubmitSearch"/>
    </div>
  </header>
  <div class="container">
    <slot/>
  </div>
  <footer class="layout-footer">
    <p class="layout-footer__copyright">
      Copyright 2013-{{_currentYear}} <a href="https://redgoose.me" target="_blank">GoOSe</a>. All right reserved.
    </p>
  </footer>
</div>
</template>

<script setup>
import { reactive, computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import navigation from '../../server/resource/navigation.json'
import Navigation from '../components/layout/navigation.vue'
import Search from '../components/layout/search.vue'

const router = useRouter()
const route = useRoute()
const store = inject('store')
const state = reactive({
  activeNavigation: false,
  search: route.query.q || '',
})

const _currentYear = computed(() => {
  return (new Date()).getFullYear()
})

function onChangeTheme(_e)
{
  store.changeTheme(_e.detail.theme)
}

function onSubmitSearch()
{
  const url = state.search ? `/?q=${encodeURIComponent(state.search)}` : '/'
  router.push(url)
}
</script>

<style src="./default.scss" lang="scss"></style>
