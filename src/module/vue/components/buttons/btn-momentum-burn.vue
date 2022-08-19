<template>
  <BtnFaicon
    icon="fire"
    class="burn-momentum"
    @click="burnMomentum"
    :disabled="disabled"
  >
    <slot name="default">
      {{ $t('IRONSWORN.Burn') }}
    </slot>
  </BtnFaicon>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { $ActorKey } from '../../provisions'
import BtnFaicon from './btn-faicon.vue'

defineProps<{ disabled?: boolean }>()
const $actor = inject($ActorKey)
const burnMomentum = () => $actor?.burnMomentum()
</script>
