<footer class="layout-footer">
  <p class="layout-footer__copyright">
    Copyright 2013-{currentYear} redgoose. All right reserved.
  </p>
</footer>

<script>
let currentYear = (new Date()).getFullYear()
</script>

<style lang="scss">
@use '../../assets/scss/mixins';
.layout-footer {
  margin: 52px 0 24px;
  box-sizing: border-box;
  &__copyright {
    text-align: center;
    margin: 0;
    font-size: 10px;
    font-weight: 400;
    color: var(--color-text-blur);
    user-select: none;
  }
  @include mixins.responsive(tablet) {
    margin: 72px 0 24px;
  }
}
</style>
