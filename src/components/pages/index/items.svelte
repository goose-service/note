<ul class="items">
  <slot/>
</ul>

<style lang="scss">
@use '../../../assets/scss/mixins';

.items {
  --color-item-split-line: hsl(0 0% 0% / 12%);
  max-width: 1440px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(var(--items-column, 1), 1fr);
  grid-gap: var(--items-gap, 1px);
  box-shadow:
    0 -1px 0 var(--color-item-split-line),
    0 1px 0 var(--color-item-split-line);
  @include mixins.dark-mode() {
    --color-item-split-line: hsl(0 0% 0% / 25%);
  }
  @include mixins.responsive(tablet) {
    grid-template-columns: repeat(var(--items-column, 2), 1fr);
    grid-gap: var(--items-gap, 16px);
    box-shadow: none;
  }
  @include mixins.responsive(desktop) {
    grid-template-columns: repeat(var(--items-column, 3), 1fr);
    grid-gap: var(--items-gap, 20px);
  }
}
</style>
