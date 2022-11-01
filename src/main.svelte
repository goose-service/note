<div class="viewport">
  <Header route={_route}/>
  <div class="container">
    {#if !$error}
      <Route path="/" let:meta>
        <Lazy component={import('./pages/index.svelte')} route={meta}/>
      </Route>
      <Route path="/nest/:nest/*">
        <Route path="/" let:meta>
          <Lazy component={import('./pages/index.svelte')} route={meta}/>
        </Route>
        <Route path="/:category/" let:meta>
          <Lazy component={import('./pages/index.svelte')} route={meta}/>
        </Route>
      </Route>
      <Route fallback let:meta>
        <div class="viewport__error">
          <Error status={404} message="Page not found"/>
        </div>
      </Route>
    {:else}
      <div class="viewport__error">
        {#if $error?.status && /^4/.test(String($error.status))}
          <Error status={$error?.status} message={$error?.message}/>
        {:else}
          <Error status={$error?.status} message={$error?.message}/>
        {/if}
      </div>
    {/if}
  </div>
  <Footer/>
</div>

<script lang="ts">
import { Route, router } from 'tinro'
import { error } from './store'
import Lazy from './components/layout/lazy.svelte'
import Header from './components/layout/header.svelte'
import Footer from './components/layout/footer.svelte'
import Error from './components/error.svelte'

let _route = undefined

router.subscribe((e) => {
  _route = e
  error.update(() => (undefined))
  window.scrollTo(0, 0)
})
</script>

<style src="./main.scss" lang="scss"></style>
