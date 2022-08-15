<template>
  <AttrSpinner v-bind="props" class="condition-meter-spinner">
    <template #label>
      <BtnRollStat
        tabindex="0"
        :buttonPostion="labelPosition"
        :documentType="documentType"
        class="text"
        :class="{ 'vertical-v2': spinnerStyle == 'vertical' }"
        :attr="attr"
      >
        {{ buttonLabel }}
      </BtnRollStat>
    </template>
  </AttrSpinner>
</template>

<style lang="less"></style>

<script setup lang="ts">
import { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import BtnRollStat from '../buttons/btn-roll-stat.vue'
import AttrSpinner from '../resource-meters/attr-spinner.vue'

const props = withDefaults(
  defineProps<{
    attr: string
    documentType: DocumentType
    buttonLabel: string
    labelPosition: 'left' | 'right'
    max: number
    min: number
    softMax?: number
    current: number
    spinnerStyle: 'horizontal' | 'vertical' | 'compact'
  }>(),
  { spinnerStyle: 'vertical' }
)
</script>
