<template>
  <!-- stateless wrapper for making consistent collapsible elements; use in composition of collapsible components -->
  <transition name="slide">
    <component :is="element" class="collapsible-content" :v-if="expanded">
      <!-- TODO: make sensitive to aria-orientation? -->
      <slot></slot>
    </component>
  </transition>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  // TODO: revisit these to see if there's a way to make these more flexible than static pixel values
  // max-height: 106px;
  &.completed {
    // max-height: 400px;
  }
}
</style>

<script>
export default {
  props: {
    element: { type: String, default: 'section' },
    expanded: { type: Boolean, default: false },
  },
}
</script>
