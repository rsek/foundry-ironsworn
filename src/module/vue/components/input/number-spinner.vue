<!-- TODO: replace credit -->

<template>
  <article :id="id" :class="classes" :aria-readonly="readonly">
    <!-- hidden from screen readers because the HTML number input already has good keyboard control -->
    <!-- this makes the other aria-* attrs useless, but they're start in place in case this needs to be changed (and because they provide useful annotation to people looking at the code) -->
    <SpinButton
      :parentId="`${id}_input`"
      :step="step"
      aria-hidden="true"
      type="decrease"
      :disabled="value === min"
      @click.capture="handleIncrement"
      @focus.prevent
      tabindex="-1"
    />
    <input
      type="number"
      v-model.number="value"
      :id="`${id}_input`"
      :autofocus="autofocus ? 'autofocus' : false"
      :min="min"
      :max="max"
      :readonly="readonly"
      :class="inputClasses"
      @input="handleInput(value)"
    />
    <SpinButton
      :parentId="`${id}_input`"
      :step="step"
      type="increase"
      :disabled="value === max"
      @click.capture="handleIncrement"
      @focus.prevent
      tabindex="-1"
    />
  </article>
</template>

<script>
export default {
  props: {
    // A unique ID for the outer element, used to derive additional IDs for use in annotating element relationships
    id: { type: String, required: true },
    // Defines a value for 'value' and 'aria-valuenow' attributes of element.
    value: {
      type: Number,
      default: 0,
    },
    // Minimum value of the number range. Provides a value for 'aria-valuemin' attributes of element.
    min: {
      type: Number,
      default: Number.MIN_SAFE_INTEGER,
    },
    // Maximum value of the number range. Provides a value for 'aria-valuemax' attributes of element.
    max: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER,
    },
    //  	increaseal step
    step: {
      type: Number,
      default: 1,
    },
    // Defines a value for 'aria-disabled' and 'disabled' attributes of element. Also disable controls buttons
    disabled: {
      type: Boolean,
      default: false,
    },
    // Defines a value for 'readonly' attribute of element.
    // also renders the buttons with `visibility: hidden`
    readonly: {
      type: Boolean,
      default: false,
    },
    // Defines a value for 'autofocus' attribute of element.
    autofocus: {
      type: Boolean,
      default: false,
    },
    // Defines position of control buttons. Acceptable values: 'split', 'start', end'.
    buttonPosition: {
      type: String,
      default: 'split',
      options: ['split', 'start', 'end'],
    },
    // Defines user's class for input element
    inputClass: {
      type: String,
    },
    // Defines user's class for increase button
    buttonIncreaseClass: {
      type: String,
    },
    // Defines user's class for decrease button
    buttonDecreaseClass: {
      type: String,
    },
    buttonIncreaseIcon: {
      type: String,
      default: 'plus',
    },
    buttonDecreaseIcon: {
      type: String,
      default: 'minus',
    },
  },
  computed: {
    /**
     * Returns classes for container
     * @return {Object} - classes object
     */
    classes() {
      let type
      switch (this.buttonPosition) {
        case 'split':
          type = 'buttons-split'
          break
        case 'start':
          type = 'buttons-start'
          break
        case 'end':
          type = 'buttons-end'
          break
      }
      return {
        'number-spinner': true,
        [type]: true,
      }
    },
    /**
     * Returns classes for down button
     * @return {Object} - classes object
     */
    buttonDecreaseClasses() {
      return this.buttonClasses('decrease')
    },
    /**
     * Returns classes for up button
     * @return {Object} - classes object
     */
    buttonIncreaseClasses() {
      return this.buttonClasses('increase')
    },

    /**
     * Returns classes for input field
     * @return {Object} - classes object
     */
    inputClasses() {
      return {
        [this.inputClass]: !!this.inputClass,
      }
    },
  },

  methods: {
    handleIncrement(increment) {
      console.log('spinner increment event', increment)
      this.handleInput(this.value + increment)
    },
    handleInput(newValue) {
      console.log('number-spinner handleInput', newValue)
      this.$emit('input', newValue)
    },
    /**
     * generates classes for input increment/decrement buttons
     * @param {string} type
     */
    buttonClasses(type) {
      return {
        [`btn-${type}`]: true,
        [`btn-${type}_inactive`]: this.value === this.min || this.disabled,
        [this[`button${type.capitalize()}Class`]]:
          !!this[`button${type.capitalize()}Class`],
      }
    },
  },
}
</script>

<style lang="less">
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
  &.buttons-split {
    display: flex;
    flex-flow: row nowrap;
    .spin-button {
      height: 100%;
      flex: 1;
      &.decrease {
        order: 1;
      }
      &.increase {
        order: 2;
      }
    }
    input[type='number'] {
      order: 2;
    }
  }
  &.buttons-start {
  }
  &.buttons-end {
  }
}
</style>
