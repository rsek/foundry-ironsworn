<template>
  <article
    :class="{ [attr]: true }"
    class="condition-meter-slider flexrow"
    style="flex-wrap: nowrap"
  >
    <BtnRollStat
      tabindex="0"
      :asset-item="assetItem"
      class="text"
      :class="{ 'vertical-v2': orientation == 'vertical' }"
      :attr="attr"
    >
      {{ buttonLabel }}
    </BtnRollStat>
    <AttrSlider
      :attr="props.attr"
      :max="props.max"
      :min="props.min"
      :softMax="props.softMax"
      :orientation="props.orientation"
      :current="props.current"
    />
    <slot></slot>
  </article>
</template>

<style lang="less"></style>

<script setup lang="ts">
import { max, min } from 'lodash'
import { inject, Ref } from 'vue'
import { AssetItem } from '../../../item/asset/assetitem.js'
import { $ActorKey } from '../../provisions.js'
import BtnRollStat from '../buttons/btn-roll-stat.vue'
import AttrSlider from '../resource-meters/attr-slider.vue'

const props = withDefaults(
  defineProps<{
    attr: string
    assetItem?: AssetItem // only required if it's an asset-specific condition meter
    labelPlacement?: 'left' | 'right'
    orientation?: 'vertical' | 'horizontal'
    buttonLabel: string
    max: number
    min: number
    softMax?: number
    current: number
  }>(),
  { labelPlacement: 'left', orientation: 'vertical' }
)
const actor = inject('actor') as Ref
const $actor = inject($ActorKey)
</script>
