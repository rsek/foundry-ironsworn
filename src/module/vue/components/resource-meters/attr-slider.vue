<template>
  <!-- TODO: lift up references to PC state from segment to this component, b/c this one needs to reference them no matter what for aria-valuenow -->
  <fieldset
    tabindex="0"
    class="attr-slider nowrap"
    :class="{
      flexcol: orientation == 'vertical',
      flexrow: orientation == 'horizontal',
    }"
    role="slider"
    :aria-valuemin="props.min"
    :aria-valuemax="props.max"
    :aria-valuenow="state.current"
    :aria-orientation="orientation"
  >
    <label
      class="clickable block attr-slider-segment"
      v-for="x in values"
      :key="x"
      :aria-selected="x == state.current"
      :aria-disabled="isDisabled(x)"
    >
      <span>
        {{ segmentLabel(x) }}
      </span>
      <input
        type="radio"
        v-model="state.current"
        :name="`${attr}-radio`"
        :value="x"
        :disabled="isDisabled(x)"
        :aria-disabled="isDisabled(x)"
      />
    </label>
  </fieldset>
</template>

<style lang="less">
@segment_border_width: 1px;
@segment_border_radius: 5px;
.attr-slider {
  border: 0;
  padding: 0;
  flex-grow: 0;
  .attr-slider-segment {
    > input[type='radio'] {
      // display: none;
    }
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
    &:focus {
      z-index: 11; // above selection/hover level so it shows when adjacent to selected/hovered items
      box-shadow: 0 0 6px var(--color-shadow-primary);
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
import { max, min, rangeRight } from 'lodash'
import { computed, inject, reactive, Ref, watch } from 'vue'
import { IronswornActor } from '../../../actor/actor.js'
import { $ActorKey } from '../../provisions.js'

const props = defineProps<{
  attr: string
  max: number
  min: number
  softMax?: number
  orientation?: 'horizontal' | 'vertical'
  item?: Item
  current: number
}>()

const actor = inject('actor') as Ref<IronswornActor>
const $actor = inject($ActorKey)

const values = computed(() => rangeRight(props.min, props.max + 1))

const state = reactive({
  current: props.current,
})

watch(state, ({ current }) => {
  $actor?.update({ data: { [props.attr]: current } })
})

/**
 * Tests whether a slider segment for a given value should be disabled.
 * @param value The value to be tested.
 */
function isDisabled(value: number) {
  if (props.softMax === undefined || props.softMax === null) {
    return false
  }
  return value > props.softMax
}

/**
 * Generates a label string for a slider segment.
 * @param value The value to generate a label for.
 */
function segmentLabel(value: number) {
  if (props.min < 0 && value > 0) {
    // only applies plus signs if there's both negative and positive values, as per the character sheets
    return `+${value}`
  }
  return value.toString()
}

// TODO: keyboard control for slider - or get the radios to work?
</script>
