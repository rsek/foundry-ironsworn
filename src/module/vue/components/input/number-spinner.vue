<!-- TODO: replace credit -->
<template>
  <article
    :id="id"
    :class="{
      'number-spinner': true,
      [`buttons-${buttonPosition}`]: true,
    }"
    :aria-readonly="readonly"
  >
    <input
      type="number"
      v-model.number="value"
      :id="`${id}_number_input`"
      :autofocus="autofocus"
      :min="min"
      :max="max"
      :readonly="readonly"
      :class="inputClass"
      :aria-valuenow="value"
      @input="onInput(value)"
    />
    <!-- hidden from screen readers because the HTML number input already has good keyboard control -->
    <!-- this makes the other aria-* attrs useless, but they're left in place in case this needs to be changed (and because they provide useful annotation to people looking at the code) -->
    <SpinButton
      :controls="`${id}_number_input`"
      :class="buttonDecreaseClass"
      :icon="buttonDecreaseIcon"
      aria-hidden="true"
      type="decrease"
      :disabled="value <= min"
      @click.capture="onInput(value - step)"
      @focus.prevent
      tabindex="-1"
    />
    <SpinButton
      :controls="`${id}_number_input`"
      :class="buttonDecreaseClass"
      :icon="buttonIncreaseIcon"
      aria-hidden="true"
      type="increase"
      :disabled="value >= max"
      @click.capture="onInput(value + step)"
      @focus.prevent
      tabindex="-1"
    />
  </article>
</template>

<script lang="ts" setup>
// adapted from https://github.com/smwbtech/vue-number-input
import { clamp } from 'lodash'
import { computed } from 'vue'
import SpinButton from './spin-button.vue'

const props = withDefaults(
  defineProps<{
    /**
     * A unique ID for the outer element, used to derive additional IDs for use in annotating element relationships
     */
    id: string
    /**
     * Defines a value for 'value' and 'aria-valuenow' attributes of element.
     */
    value?: number
    /**
     * Minimum value of the number input.
     */
    min?: number
    /**
     * Maximum value of the number input.
     */
    max?: number
    /**
     * Step value of the numbr input.
     */
    step?: number
    /**
     * Defines a value for 'aria-disabled' and 'disabled' attributes of element. Also disable controls buttons.
     */
    disabled?: boolean
    /**
     * Defines a value for 'readonly' attribute of the number input. Also renders the buttons with `visibility: hidden`.
     */
    readonly?: boolean
    /**
     * Defines a value for 'autofocus' attribute of the number input.
     */
    autofocus?: boolean
    /**
     * Defines position of control buttons.
     */
    buttonPosition?:
      | 'split-horizontal'
      | 'split-vertical'
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
    /**
     * Defines user's class for input element
     */
    inputClass?: any
    /**
     * Defines user's class for increase button
     */
    buttonIncreaseClass?: any
    /**
     * Defines user's class for decrease button
     */
    buttonDecreaseClass?: any
    buttonIncreaseIcon?: string
    buttonDecreaseIcon?: string
  }>(),
  {
    value: 0,
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
    step: 1,
    disabled: false,
    readonly: false,
    autofocus: false,
    buttonPosition: 'split-horizontal',
    buttonIncreaseIcon: 'plus',
    buttonDecreaseIcon: 'minus',
  }
)

const $emit = defineEmits<{
  (event: 'input', value: number): void
}>()

function onInput(newValue: number) {
  console.log('number-spinner handleInput', newValue)
  $emit('input', clamp(newValue, props.min, props.max))
}
</script>

<style lang="less" scoped>
.number-spinner {
  @anim_length: 0.25s;
  align-items: center;
  padding: 0px;
  input[type='number'] {
    border: none;
    appearance: textfield;
    -moz-appearance: textfield;
    transition: @anim_length all ease-in-out;
    &[readonly] {
      pointer-events: none;
      background: none;
    }
  }
  .spin-button {
    aspect-ratio: 1;
    margin: 0;
    // 'visibility' doesn't animate, so we cheat a bit with opacity
    transition: visibility 0s ease-in-out, opacity @anim_length ease-in-out;
  }
  &[aria-readonly] {
    .spin-button {
      visibility: hidden !important;
      opacity: 0;
      transition: visibility @anim_length ease-in-out,
        opacity @anim_length ease-in-out;
    }
  }
  &.buttons-top,
  &.buttons-left,
  &.buttons-right,
  &.buttons-bottom {
    display: grid;
    grid-template-columns: max-content;
    grid-template-rows: max-content min-content;
  }
  &.buttons-top {
    input[type='number'] {
      grid-column: 1 / span 2;
      grid-row: 2;
    }
  }
  &.buttons-bottom {
    input[type='number'] {
      grid-column: 1 / span 2;
      grid-row: 1;
    }
  }
  &.buttons-left {
    input[type='number'] {
      grid-row: 1 / span 2;
      grid-column: 2;
    }
  }
  &.buttons-right {
    input[type='number'] {
      grid-row: 1 / span 2;
      grid-column: 1;
    }
  }
  &.buttons-split-horizontal,
  &.buttons-split-vertical {
    display: flex;
    .decrease {
      order: 1;
    }
    input[type='number'] {
      order: 2;
    }
    .increase {
      order: 3;
    }
  }
  &.buttons-split-horizontal {
    flex-direction: row;
  }
  &.buttons-split-vertical {
    flex-direction: column;
  }
}
</style>
