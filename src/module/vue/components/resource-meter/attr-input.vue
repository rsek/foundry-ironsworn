<template>
  <article
    class="attr-input"
    :class="{ [`label-${props.labelPosition}`]: true }"
    :aria-labelledby="`${baseId}-label`"
  >
    <section
      v-if="labelPosition != 'none'"
      class="attr-input-label"
      :id="`${baseId}-label`"
      :for="`${baseId}-input`"
    >
      <slot name="label"></slot>
    </section>
    <section class="attr-input-element">
      <SliderBar
        v-if="widgetStyle === 'slider'"
        v-bind="{ ...sharedWidgetProps, ...sliderProps }"
        class="attr-input-slider"
        :segments="props.max"
        :max="props.softMax ?? props.max"
        @change="setAttr"
      />
      <NumberSpinner
        v-if="widgetStyle === 'spinner'"
        v-bind="{ ...sharedWidgetProps, ...spinnerProps }"
        class="attr-input-spinner"
        :max="props.max"
        @input="setAttr"
      />
    </section>
    <slot></slot>
  </article>
</template>

<style lang="less" scoped>
.attr-input-label {
  text-transform: uppercase;
  line-height: 1;
  display: flex;
  align-items: center;
  > * {
    text-transform: inherit;
  }
}
.attr-input {
  display: flex;
  .label-right,
  .label-left {
    flex-direction: row;
  }
  .label-top,
  .label-bottom {
    flex-direction: column;
  }
  .label-top,
  .label-left {
    .attr-input-label {
      order: 1;
    }
    .attr-input-element {
      order: 2;
    }
  }
  .label-bottom,
  .label-right {
    .attr-input-label {
      order: 2;
    }
    .attr-input-element {
      order: 1;
    }
  }
}
</style>

<script lang="ts" setup>
import { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import { computed } from 'vue'
import { IronswornSettings } from '../../../helpers/settings.js'
import { pickInjectedDocument } from '../../composable/pickInjectedDocument.js'
import SliderBar from '../input/slider-bar.vue'
import NumberSpinner from '../input/number-spinner.vue'
import { pick } from 'lodash'

/**
 * An input that controls the numeric value of an attribute. It can be rendered as a {@link SliderBar} or a {@link NumberSpinner}.
 */
const props = withDefaults(
  defineProps<{
    /**
     * Whether the widget is rendered as {@link SliderBar} or a {@link NumberSpinner}.
     */
    widgetStyle: 'spinner' | 'slider'
    /**
     * The key of the attribute controlled by the slider. This is the property of the injected document that will be controlled.
     */
    attr: string
    /**
     * The type of injectable document to use. Currently only "Actor" and "Item" work - they'll target `ActorKey`/`$ActorKey` or `ItemKey`/`$ItemKey` as appropriate.
     * @see {$ActorKey}
     * @see {$ItemKey}
     */
    documentType: DocumentType
    /**
     * When 'true' and documentType is set to "Actor", updates *all* actors of the 'shared' and 'character' types.
     */
    global?: boolean
    max: number
    min?: number
    softMax?: number
    value: number
    readOnly?: boolean
    labelPosition?: 'right' | 'left' | 'top' | 'bottom' | 'none'
    spinnerProps?: Omit<
      InstanceType<typeof NumberSpinner>['$props'],
      'id' | 'max' | 'min' | 'value' | 'readOnly'
    >
    sliderProps?: Omit<
      InstanceType<typeof SliderBar>['$props'],
      'id' | 'max' | 'min' | 'value' | 'readOnly'
    >
  }>(),
  {
    global: false,
    readOnly: false,
    orientation: 'vertical',
    labelPosition: 'left',
    min: 0,
  }
)

const { $document } = pickInjectedDocument(props.documentType)

const baseId = computed(
  () => `${$document?.id}-attr-${props.widgetStyle}-${props.attr}`
)

const sharedWidgetProps = computed(() => ({
  ...pick(props, 'value', 'min', 'readOnly'),
  id: `${baseId.value}-input`,
}))

async function setAttr(newValue: number) {
  const data = {
    data: { [props.attr]: newValue },
  }
  // redundant with the below if it's global, but fires anyway so that a single message appears in the chatlog.
  $document?.update(data)
  if (props.global) {
    await IronswornSettings.updateGlobalAttribute(data)
  }
}
</script>
