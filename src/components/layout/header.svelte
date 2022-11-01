<header class="header">
  <div class="header__wrap">
    <h1 class="header__logo header-logo">
      <a href={navigation.home.href} title={navigation.home.label} on:click={onClickLink}>
        <img src="/images/ico-logo.svg" alt="redgoose"/>
      </a>
    </h1>
    <nav class="header__gnb header-gnb">
      <ToggleButton
        title="toggle menu"
        active={activeNavigation}
        on:click={onClickNavigationToggle}>
        {#if !activeNavigation}
          <Icon name="menu"/>
        {:else}
          <Icon name="x"/>
        {/if}
      </ToggleButton>
      <div
        class="header-gnb__menu"
        class:on={activeNavigation}
        aria-hidden="true"
        on:click={onClickMenu}>
        <ul>
          {#each gnb as o,k}
            <li>
              <a href={o.href} target={o.target} use:active on:click={onClickLink}>
                {o.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </nav>
    <div class="header__search header-search">
      <ToggleButton
        title="Toggle search form"
        active={activeSearchForm}
        isKeyword={!!route?.query?.q}
        on:click={onClickSearchFormToggle}>
        {#if !activeSearchForm}
          <Icon name="search"/>
        {:else}
          <Icon name="x"/>
        {/if}
      </ToggleButton>
      {#if activeSearchForm}
        <form
          aria-hidden="true"
          class="header-search__form"
          on:click|stopPropagation={() => {}}
          on:submit|preventDefault={onSubmitKeywordSearch}>
          <fieldset>
            <legend>search keyword form</legend>
            <input
              type="text"
              name="q"
              placeholder="Please search keyword"
              maxlength="32"
              bind:value={keyword}
              bind:this={_searchInput}/>
            <button
              type="reset"
              title="Clear search keyword."
              on:click={onResetKeyword}>
              <Icon name="x-circle"/>
            </button>
            <button type="submit" title="Submit search keyword.">
              <Icon name="search"/>
            </button>
          </fieldset>
        </form>
      {/if}
    </div>
  </div>
</header>

<script lang="ts">
import { active } from 'tinro'
import { router } from 'tinro'
import { Icon } from '../icons'
import navigation from '../../../server/resource/navigation.json'
import ToggleButton from './toggle-button.svelte'

export let route = undefined
let _searchInput
let activeNavigation: boolean = false
let activeSearchForm: boolean = false
let keyword = route?.query?.q || ''

$: gnb = navigation.global.map((o) => ({
  label: o.label,
  href: o.href,
  target: /^http/.test(o.href) ? '_blank' : '',
}))
$: if (route?.query) updateKeyword()

function onClickMenu(e): void
{
  if (!e.target.classList.contains('header-gnb__menu')) return
  e.stopPropagation()
}

function onClickLink(e: PointerEvent): void
{
  if (!e.currentTarget) return
  (e.currentTarget as HTMLElement).blur()
  onCloseDropdown()
  window.removeEventListener('click', onCloseDropdown)
}

function onClickNavigationToggle(): void
{
  activeNavigation = !activeNavigation
  activeSearchForm = false
  if (activeNavigation)
  {
    window.addEventListener('click', onCloseDropdown, { once: true })
  }
}
function onClickSearchFormToggle(): void
{
  activeSearchForm = !activeSearchForm
  activeNavigation = false
  if (activeSearchForm)
  {
    window.addEventListener('click', onCloseDropdown, { once: true })
    setTimeout(() => _searchInput.focus(), 80)
  }
}

function onSubmitKeywordSearch(): void
{
  if (keyword)
  {
    router.goto(`/?q=${keyword}`)
  }
  else
  {
    router.goto(`/`)
  }
  onCloseDropdown()
}

function onResetKeyword(): void
{
  keyword = ''
}

function onCloseDropdown(_: PointerEvent = undefined): void
{
  activeNavigation = false
  activeSearchForm = false
}

function updateKeyword(): void
{
  keyword = route?.query?.q ? decodeURIComponent(route.query.q) : ''
}
</script>

<style src="./header.scss" lang="scss"></style>
