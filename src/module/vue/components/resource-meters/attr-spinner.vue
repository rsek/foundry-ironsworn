<template>
  <article
    class="attr-spinner"
    :class="{ [`label-${labelPosition}`]: true }"
    :aria-labelledby="`${baseId}-label`"
    tabindex="0"
    ref="$spinnerWrapper"
    role="spinbutton"
    :aria-valuemin="props.min"
    :aria-valuemax="currentMax"
    :aria-valuenow="state.current"
    :aria-orientation="spinnerStyle !== 'compact' ? spinnerStyle : ''"
    @keydown.arrow-up="stepUp"
    @keydown.+="stepUp"
    @keydown.-="stepDown"
    @keydown.arrow-down="stepDown"
    @keydown.page-up="state.current = currentMax"
    @keydown.page-down="state.current = min"
    @keydown.0="setCurrent(0)"
    @keydown.1="setCurrent(1)"
    @keydown.2="setCurrent(2)"
    @keydown.3="setCurrent(3)"
    @keydown.4="setCurrent(4)"
    @keydown.5="setCurrent(5)"
    @keydown.6="setCurrent(6)"
    @keydown.7="setCurrent(7)"
    @keydown.8="setCurrent(8)"
    @keydown.9="setCurrent(9)"
  >
    <!-- spinbutton role: "A form of range that expects the user to select from among discrete choices." -->
    <section
      tabindex="-1"
      class="attr-spinner-label nogrow"
      :class="{ 'vertical-v2': spinnerStyle === 'vertical' }"
      :id="`${baseId}-label`"
    >
      <!-- TODO: should this be an heading tag? -->
      <slot name="label">
        <!-- button or static label goes here -->
        <!-- the tabindex for this item should be -1 -->
      </slot>
    </section>
    <slot name="default"></slot>
    <input
      type="number"
      v-if="props.spinnerStyle === 'compact'"
      :min="min"
      :max="currentMax"
    />
    <!--
      SpinnerBar already has aria annotations to function as a spinner on its own. however, these are managed by the outermost wrapper of this component, instead.

      that way, the user doesnt have to tab deeper into the hierarchy to use the meter commands.
    -->
    <spinner-bar
      v-else
      class="attr-spinner-bar"
      aria-hidden
      tabindex="-1"
      :orientation="props.spinnerStyle"
      :max="props.max"
      :min="props.min"
      :softMax="props.softMax"
      :current="state.current"
      @input="setCurrent"
      @click.prevent.self
      @focus.prevent="$spinnerWrapper?.focus()"
    >
    </spinner-bar>
  </article>
</template>

<style lang="less">
@segment_border_width: 1px;
@segment_border_radius: 5px;

.attr-spinner {
  &[aria-orientation='vertical'] {
    display: grid;
    grid-auto-flow: column;
    place-items: start;
    grid-template-columns: max-content max-content;
    grid-template-rows: max-content max-content max-content;
    .attr-spinner-label {
      grid-row: 1;
      max-height: 50%;
    }
    .attr-spinner-bar {
      grid-row: 1;
    }
    &.label-left {
      .attr-spinner-label {
        grid-column: 1;
      }
    }
    &.label-right {
      .attr-spinner-label {
        grid-column: 2;
      }
    }
  }
  &[aria-orientation='horizontal'] {
    display: flex;
    flex-direction: row wrap;
    justify-items: space-between;
    .attr-spinner-label {
      > * {
        padding-inline-end: @segment_border_radius;
      }
    }
  }
  &:focus {
    outline: none;
    // background: #0001;
    .attr-spinner-bar {
      box-shadow: 0 0 6px var(--color-shadow-primary);
    }
  }
  .attr-spinner-label {
    text-transform: uppercase;
    line-height: 1;
    display: flex;
    > * {
      text-transform: inherit;
    }
  }
}
</style>

<script lang="ts" setup>
/**
 * A spinner that controls the value of an attribute.
 * Under the hood, it's a `<fieldset>` with radio `<input>`s.
 */
import { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import { clamp, inRange, kebabCase, rangeRight, startCase } from 'lodash'
import { computed, reactive, ref, watch } from 'vue'
import { pickInjectedDocument } from '../../composable/pickInjectedDocument.js'
import SpinnerBar from './spinner-bar.vue'

const props = withDefaults(
  defineProps<{
    /**
     * The key of the attribute controlled by the spinner. This is the property of the injected document that will be controlled.
     */
    attr: string
    /**
     * The type of injectable document to use. Currently only "Actor" and "Item" work - they'll target `$ActorKey` or `$ItemKey` as appropriate.
     * @see {$ActorKey}
     * @see {$ItemKey}
     */
    documentType: DocumentType
    max: number
    min?: number
    softMax?: number
    current: number
    spinnerStyle?: 'vertical' | 'horizontal' | 'compact'
    labelPosition?: 'right' | 'left'
  }>(),
  { spinnerStyle: 'vertical', labelPosition: 'left', min: 0 }
)

const state = reactive({
  current: props.current,
})
const { $document } = pickInjectedDocument(props.documentType)

const $spinnerWrapper = ref<HTMLElement>()

//  TODO: this isn't generating properly
const baseId = computed(
  () => `${$document?._id ?? $document?.id}-attr-spinner-${props.attr}`
)

const spinnerValues = computed(() => rangeRight(props.min, props.max + 1))
const currentMax = computed(() =>
  props.softMax ? Math.min(props.softMax, props.max) : props.max
)

const keybindData = computed(() => {
  const arr: {
    keys: (number | string)[]
    description: string
    fn: (event: KeyboardEvent) => void
  }[] = [
    { keys: ['ArrowUp', '+'], description: 'Increase by 1.', fn: stepUp },
    { keys: ['ArrowDown', '-'], description: 'Decrease by 1.', fn: stepDown },
    {
      keys: ['Home'],
      description: `Set to maximum (${currentMax.value}).`,
      fn: () => (state.current = currentMax.value),
    },
    {
      keys: ['End'],
      description: `Set to minimum (${props.min}).`,
      fn: () => (state.current = props.min),
    },
  ]

  spinnerValues.value
    // filters for values that exist on typical keyboards, 0-9
    .filter((v) => inRange(v, 0, 10))
    .forEach((value) => {
      arr.push({
        keys: [value],
        description: 'Set to a specific value.',
        fn: () => setCurrent(value),
      })
    })
  return arr
})

const keydownDirective = computed(() => {
  const obj: Record<string | number, (...args) => void> = {}
  keybindData.value.forEach((keyData) => {
    keyData.keys.forEach((k) => {
      let key: string | number
      if (typeof k === 'string' && k.match(/[A-z]/)) {
        key = kebabCase(k)
      } else {
        key = k
      }
      obj[key] = keyData.fn
    })
  })
  return obj
})

console.log('keydownDirective', keydownDirective.value)
// TODO: figure out a way to localize this that isn't totally silly
// might be better handled by a component of its own, TBH, as the composition is fairly complex
// TODO: this needs to be computed or something.

watch(state, ({ current }) => {
  $document?.update({
    data: { [props.attr]: clampedValue(current) },
  })
})

function clampedValue(value: number) {
  return clamp(value, props.min, currentMax.value)
}

function stepDown() {
  console.log('stepdown')
  if (state.current > props.min) state.current--
}

function stepUp() {
  console.log('stepUp')
  if (state.current < currentMax.value) state.current++
}

function setCurrent(value: number) {
  console.log('setCurrent', value)
  state.current = clampedValue(value)
}
</script>
