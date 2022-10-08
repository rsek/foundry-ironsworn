<template>
  <AttrInput
    class="condition-meter"
    :documentType="documentType"
    :attr="props.attr"
    :orientation="sliderStyle"
    :value="value"
    :min="0"
    :max="max"
    :softMax="softMax"
    :read-only="readOnly"
    :global="global"
    :widgetStyle="widgetStyle"
  >
    <template #label>
      <BtnRollstat
        v-if="labelPosition != 'none'"
        tabindex="0"
        :documentType="documentType"
        class="text"
        :class="{ vertical: sliderStyle === 'vertical' }"
        :attr="attr"
        :statLabel="statLabel"
      >
        {{ statLabel }}
      </BtnRollstat>
    </template>
  </AttrInput>
</template>

<script setup lang="ts">
import { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import BtnRollstat from '../buttons/btn-rollstat.vue'
import { inject } from 'vue'
import { ItemKey } from '../../provisions.js'
import AttrInput from './attr-input.vue'

const props = withDefaults(
  defineProps<{
    /**
     * The key of the attribute controlled by the slider. This is the property of the injected document that will be controlled.
     */
    attr: string
    /**
     * The type of injectable document to use. Currently only "Actor" and "Item" work - they'll target `$ActorKey` or `$ItemKey` as appropriate.
     *
     * @see {$ActorKey}
     * @see {$ItemKey}
     */
    documentType: DocumentType
    /**
     * When 'true' and documentType is set to "Actor", updates *all* actors of the 'shared' and 'character' types.
     */
    global?: boolean
    max: number
    softMax?: number
    value: number
    sliderStyle?: 'vertical' | 'horizontal'
    labelPosition?: 'right' | 'left' | 'top' | 'bottom' | 'none'
    /**
     * This string will be inserted in into the tooltip text "Roll +{x}" on the roll button. It should already be localized.
     */
    statLabel: string
    readOnly?: boolean
    /**
     * Whether the widget is rendered as {@link SliderBar} or a {@link NumberSpinner}.
     */
    widgetStyle: 'spinner' | 'slider'
  }>(),
  {
    sliderStyle: 'vertical',
    labelPosition: 'left',
    readOnly: false,
    global: false,
  }
)

const item = inject(ItemKey)
</script>
