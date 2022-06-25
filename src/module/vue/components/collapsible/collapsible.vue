<template>
  <component :is="wrapper">
    <slot name="toggle">
      <!-- how is this getting options like onclick and state? -->
    </slot>
    <slot name="content">
      <!-- how is this getting options for state? -->
    </slot>
  </component>
</template>

<style lang="less">
.collapsible {
  .collapsible-toggle {
    text-transform: uppercase;
    height: inherit;
    width: inherit;
    flex-grow: 1;
  }
  h1 {
    display: flex;
  }
}
</style>

<script>
export default {
  props: {
    wrapper: { type: String },
  },
}
</script>
