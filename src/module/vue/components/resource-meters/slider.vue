<template>
  <article
    class="nogrow slider"
    :class="{
      flexcol: orientation == 'vertical',
      flexrow: orientation == 'horizontal',
    }"
    role="slider"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-orientation="orientation"
  >
    <SliderSegment
      v-for="x in values"
      :key="x"
      :attr="attr"
      :value="x"
      :softMax="softMax"
    />
    <!-- TODO: consider backing with an invisible 'number' input for keyboard access? -->
  </article>
</template>

<style lang="less">
.slider {
  flex-grow: 0;
  .slider-segment {
    flex: 0 0 auto;
    min-width: 50px;
    border: 1px solid;
    border-top: none;
    text-align: center;
    line-height: 28px;
    position: relative;
    z-index: 1;
    padding: 0;
    &:hover,
    &[aria-selected='true'] {
      z-index: 10; // with position: relative, ensures that hovered item borders/filters aren't rendered behind other items
    }
    &:first-child {
      border-top: 1px solid;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    &:last-child {
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
}
</style>

<script lang="ts" setup>
import { computed } from 'vue'
import SliderSegment from './slider-segment.vue'

const props = defineProps<{
  attr: string
  max: number
  min: number
  softMax?: number
  orientation: 'horizontal' | 'vertical'
}>()

const values = computed(() => {
  const ret = [] as number[]
  const increment = props.max > props.min ? -1 : 1 //TODO: use CSS to reorder for presentational purposes
  let value = props.max
  do {
    ret.push(value)
    value += increment
  } while (value != props.min + increment)
  return ret
})
</script>
