<template>
  <BtnFaicon
    tabindex="-1"
    class="spin-button"
    :class="{
      [type]: true,
    }"
    :icon="icon"
    :aria-controls="controls"
    :disabled="disabled"
    @click="$emit('click')"
  />
</template>
<style lang="less" scoped>
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
<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import BtnFaicon from '../buttons/btn-faicon.vue'

const props = withDefaults(
  defineProps<{
    /**
     * Sets the ID of the element that this spin button controls.
     */
    controls: string
    type: 'increase' | 'decrease'
    disabled?: boolean
    icon?: string | undefined
  }>(),
  {
    disabled: false,
  }
)
const icon = computed(
  () => props.icon ?? (props.type === 'increase' ? 'plus' : 'minus')
)
</script>
