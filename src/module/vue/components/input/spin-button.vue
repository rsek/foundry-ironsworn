<template>
  <btn-faicon
    tabindex="-1"
    class="spin-button block"
    :class="classes"
    aria-hidden="true"
    v-model.number="value"
    :tooltip="tooltip"
    :icon="icon"
    :aria-controls="`${parentId}_${type}`"
    :disabled="disabled"
    @click="$emit('click', value)"
  />
</template>
<style lang="less">
.spin-button {
  cursor: pointer;
  overflow: hidden;
  border: none;
  &.increase {
  }
  &.decrease {
  }
}
</style>
<script>
export default {
  props: {
    parentId: { type: String, required: true },
    step: { type: Number, default: 1 },
    tooltip: { type: String },
    type: { type: String, options: ['increase', 'decrease'], required: true },
    disabled: { type: Boolean, default: false },
  },

  computed: {
    value() {
      return this.type === 'increase'
        ? parseInt(this.step)
        : parseInt(-this.step)
    },
    icon() {
      return this.type === 'increase' ? 'plus' : 'minus'
    },
    classes() {
      return {
        [this.type]: true,
      }
    },
  },
}
</script>
