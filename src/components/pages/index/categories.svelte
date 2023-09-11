<nav
  class="categories"
  class:opened={opened}>
  <button
    type="button"
    class="categories__button"
    title={_toggleButtonName}
    on:click={onClickControlButton}>
    <span>Categories / {_activeCategoryName}</span>
    <Icon name="chevron-down"/>
  </button>
  <ul class="categories__index">
    {#each items as item, k}
      <li class:on={item.srl === active}>
        <a href={item.link}>
          <span>{item.label}</span>
          <em>{item.count}</em>
        </a>
      </li>
    {/each}
  </ul>
</nav>

<script>
import { Icon } from '../../icons'

let opened = false
export let active = ''
export let items = []

$: _activeCategoryName = items.filter(o => (o.srl === active))[0]?.label || 'All'
$: _toggleButtonName = opened ? `Close categories selector` : 'Open categories selector'

function onClickControlButton()
{
  opened = !opened
}
</script>

<style src="./categories.scss" lang="scss"></style>
