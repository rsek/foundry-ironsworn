<template>
  <!-- TODO: lift up references to PC state from segment to this component, b/c this one needs to reference them no matter what for aria-valuenow -->
  <article
    class="attr-slider"
    :class="{
      flexcol: orientation == 'vertical',
      flexrow: orientation == 'horizontal',
    }"
    role="slider"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuenow="current"
    :aria-orientation="orientation"
  >
    <AttrSliderSegment
      v-for="x in values"
      :key="x"
      :attr="attr"
      :value="x"
      :softMax="softMax"
      :current="current"
    />
    <!-- TODO: consider backing with an invisible 'number' input for keyboard access? -->
  </article>
</template>

<style lang="less">
@segment_border_width: 1px;
@segment_border_radius: 5px;
.attr-slider {
  flex-grow: 0;
  .attr-slider-segment {
    box-sizing: border-box;
    flex: 0 0 auto;
    min-width: 50px;
    border: @segment_border_width solid currentColor;
    text-align: center;
    line-height: 28px;
    position: relative;
    z-index: 1;
    padding: 0;
    &:hover,
    &[aria-selected='true'] {
      z-index: 10; // with position: relative, ensures that hovered item borders/filters aren't rendered behind other items
    }
  }
  &[aria-orientation='vertical'] {
    .attr-slider-segment {
      &:not(:first-child) {
        margin-block-start: -@segment_border_width;
      }
      &:first-child {
        border-start-start-radius: @segment_border_radius;
        border-start-end-radius: @segment_border_radius;
      }
      &:last-child {
        border-end-start-radius: @segment_border_radius;
        border-end-end-radius: @segment_border_radius;
      }
    }
  }
  &[aria-orientation='horizontal'] {
    .attr-slider-segment {
      &:not(:first-child) {
        margin-block-start: -@segment_border_width;
      }
      &:first-child {
        border-top-left-radius: @segment_border_radius;
        border-bottom-left-radius: @segment_border_radius;
      }
      &:last-child {
        border-top-right-radius: @segment_border_radius;
        border-top-right-radius: @segment_border_radius;
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { max, min, rangeRight } from 'lodash'
import { computed, inject, Ref } from 'vue'
import { IronswornActor } from '../../../actor/actor.js'
import { $ActorKey } from '../../provisions.js'
import AttrSliderSegment from './attr-slider-segment.vue'

const props = defineProps<{
  attr: string
  max: number
  min: number
  softMax?: number
  orientation?: 'horizontal' | 'vertical'
  item?: Item
}>()

const actor = inject('actor') as Ref<IronswornActor>
const $actor = inject($ActorKey)

const values = computed(() => rangeRight(props.min, props.max + 1))

const current = computed(() => actor.value.data[props.attr])
</script>
