<template>
  <button
    type="button"
    @click="click"
    class="clickable block stack-row slider-segment"
    :aria-disabled="disabled"
    :aria-selected="selected"
    :class="classes"
    :data-resource="attr"
    :data-value="value"
  >
    {{ valueStr }}
  </button>
</template>

<script lang="ts" setup>
import { computed, inject, Ref } from 'vue'
import { IronswornSettings } from '../../../helpers/settings'
import { $ActorKey } from '../../provisions'

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)

const props = defineProps<{
  attr: string
  value: number
  softMax?: number
}>()

const valueStr = computed(() => {
  return props.value > 0 ? `+${props.value}` : props.value.toString()
})
const current = computed(() => {
  return actor.value.data[props.attr]
})
const selected = computed(() => {
  return current.value === props.value
})
const disabled = computed(() => {
  if (props.softMax === undefined) return false
  return props.value > props.softMax
})

const classes = computed(() => ({
  [props.attr]: true,
  selected: selected.value,
  disabled: disabled.value,
}))

function click() {
  // TODO: do this with something more broadly applicable than string comparison
  if (disabled.value) return
  $actor?.update({ data: { [props.attr]: props.value } })
  if (props.attr === 'supply') {
    IronswornSettings.maybeSetGlobalSupply(props.value)
  }
}
</script>
