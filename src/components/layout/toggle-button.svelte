<button
  title={title}
  class="toggle-button"
  class:toggle-button--on={active}
  on:click|stopPropagation={() => dispatch('click')}>
  <slot/>
</button>

<script lang="ts">
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()
export let title: string = 'title'
export let active: boolean = false
</script>

<style lang="scss">
@use '../../assets/scss/mixins';
.toggle-button {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: hsl(0 0% 0% / 0%);
  border: none;
  @include mixins.button-setup();
  transition: background-color 120ms ease-out, box-shadow 120ms ease-out;
  font-size: 0;
  --icon-display: block;
  --icon-margin: 0 auto;
  --icon-size: 20px;
  --icon-stroke: 2.5;
  &:active {
    background: var(--header-active-bg);
  }
  &--on {
    background: var(--header-active-bg);
  }
  &:focus-visible {
    box-shadow:
      inset 0 0 0 4px hsl(var(--color-key-hsl) / 15%),
      inset 0 0 0 1px hsl(var(--color-key-hsl) / 100%);
  }
}
</style>
