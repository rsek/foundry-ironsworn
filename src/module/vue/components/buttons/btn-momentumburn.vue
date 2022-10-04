<template>
  <btn-faicon
    icon="fire"
    class="burn-momentum"
    @click="burnMomentum"
    :disabled="disabled"
    :tooltip="tooltip"
  >
    <slot name="default"></slot>
  </btn-faicon>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { inject } from 'vue'
import { CharacterDataProperties } from '../../../actor/actortypes'
import { $CharacterKey } from '../../provisions'
import btnFaicon from './btn-faicon.vue'

defineProps<{ disabled?: boolean }>()
const $character = inject($CharacterKey)

const tooltip = computed(() => {
  const { momentum, momentumReset } = (
    $character?.data as CharacterDataProperties
  )?.data
  return game.i18n.format('IRONSWORN.BurnMomentumAndResetTo', {
    value: momentum,
    resetValue: momentumReset,
  })
})

const burnMomentum = () => $character?.burnMomentum()
</script>
