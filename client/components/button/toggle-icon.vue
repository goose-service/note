<template>
<button
  :class="[
    'button-toggle-icon',
    props.open && 'on'
  ]">
  <slot/>
</button>
</template>

<script setup>
const props = defineProps({
  open: Boolean,
  icons: Array,
})
</script>

<style src="./toggle-icon.scss" lang="scss" scoped></style>
