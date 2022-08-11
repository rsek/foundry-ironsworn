<template>
  <article
    :class="{ [attr]: true }"
    class="nogrow condition-meter-slider flexrow"
    style="flex-wrap: nowrap"
  >
    <BtnRollStat class="nogrow vertical-v2 text" :attr="attr">
      {{ buttonLabel }}
    </BtnRollStat>
    <Slider :attr="attr" :max="max" :min="min" :orientation="orientation" />
  </article>
</template>

<style lang="less"></style>

<script setup lang="ts">
import BtnRollStat from '../buttons/btn-roll-stat.vue'
import Slider from '../resource-meters/slider.vue'

const props = defineProps<{
  attr: string
  labelPlacement: 'right' | 'left'
  orientation: 'vertical' | 'horizontal'
  buttonLabel: string
  max: number
  min: number
  softMax?: number
}>()
</script>
