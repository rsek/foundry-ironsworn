<template>
  <div
    class="spinner-bar nowrap"
    :class="{
      flexcol: orientation == 'vertical',
      flexrow: orientation == 'horizontal',
    }"
    role="spinbutton"
    :aria-valuemin="props.min"
    :aria-valuemax="currentMax"
    :aria-valuenow="current"
    :aria-orientation="orientation"
  >
    <button
      type="button"
      class="clickable block spinner-bar-segment"
      tabindex="-1"
      v-for="x in spinnerValues"
      :key="x"
      :aria-selected="x === current"
      :aria-disabled="!inRange(x, min, currentMax + 1)"
      @click.prevent.self="$emit('input', x)"
    >
      <span tabindex="-1" class="spinner-bar-segment-text">
        {{ segmentLabel(x) }}
      </span>
    </button>
  </div>
</template>

<style lang="less">
@segment_border_width: 1px;
@segment_border_radius: 5px;

.spinner-bar {
  border-radius: @segment_border_radius; // so the focus effect aligns properly
  grid-row: 1;
  border: 0;
  padding: 0;
  flex-grow: 0;
  .spinner-bar-segment {
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
    .spinner-bar-segment {
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
    .spinner-bar-segment {
      &:not(:first-child) {
        margin-inline-start: -@segment_border_width;
      }
      &:first-child {
        border-top-left-radius: @segment_border_radius;
        border-bottom-left-radius: @segment_border_radius;
      }
      &:last-child {
        border-top-right-radius: @segment_border_radius;
        border-bottom-right-radius: @segment_border_radius;
      }
    }
  }
}
</style>

<script lang="ts" setup>
/**
 * A bar that functions as a number spinner.
 */
import { inRange, rangeRight } from 'lodash'
import { computed } from 'vue'

const emits = defineEmits<{
  (e: 'input', value: number): void
}>()

const props = withDefaults(
  defineProps<{
    max: number
    min: number
    current: number
    softMax?: number
    orientation?: 'horizontal' | 'vertical'
  }>(),
  {
    orientation: 'vertical',
  }
)

const currentMax = computed(() =>
  props.softMax ? Math.min(props.softMax, props.max) : props.max
)

const spinnerValues = computed(() => rangeRight(props.min, props.max + 1))

/**
 * Generates a label string for a spinner segment.
 * @param value The value to generate a label for.
 */
function segmentLabel(value: number) {
  if (props.min < 0 && value > 0) {
    // only applies plus signs if there's both negative and positive values, as per the character sheets
    return `+${value}`
  }
  return value.toString()
}
</script>
