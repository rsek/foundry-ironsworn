<template>
  <BtnFaicon
    tabindex="-1"
    class="spin-button block"
    :class="{
      [type]: true,
    }"
    v-model.number="value"
    :tooltip="tooltip"
    :icon="icon"
    :aria-controls="`${parentId}_${type}`"
    :disabled="disabled"
    @click="$emit('click', value)"
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
    parentId: string
    step?: number
    tooltip: string
    type: 'increase' | 'decrease'
    disabled?: boolean
  }>(),
  {
    step: 1,
    disabled: false,
  }
)

const value = computed(() =>
  props.type === 'increase' ? props.step : -props.step
)
const icon = computed(() => (props.type === 'increase' ? 'plus' : 'minus'))
</script>
