<template>
	<AttrSlider
		class="condition-meter"
		:document-type="documentType"
		:attr="props.attr"
		:slider-style="sliderStyle"
		:current-value="currentValue"
		:min="0"
		:max="max"
		:soft-max="softMax"
		:read-only="readOnly"
		:global="global">
		<template #label>
			<BtnRollstat
				v-if="labelPosition != 'none'"
				:class="$style.btn"
				tabindex="0"
				:document-type="documentType"
				:vertical="sliderStyle === 'vertical'"
				:attr="attr"
				:stat-label="statLabel"
				:text="statLabel" />
		</template>
	</AttrSlider>
</template>

<script setup lang="ts">
import AttrSlider from './attr-slider.vue'
import BtnRollstat from '../buttons/btn-rollstat.vue'

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
		documentType: 'Actor' | 'Item'
		/**
		 * When 'true' and documentType is set to "Actor", updates *all* actors of the 'shared' and 'character' types.
		 */
		global?: boolean
		max: number
		softMax?: number
		currentValue: number
		sliderStyle?: 'vertical' | 'horizontal'
		labelPosition?: 'right' | 'left' | 'none'
		/**
		 * This string will be inserted in into the tooltip text "Roll +{x}" on the roll button. It should already be localized.
		 */
		statLabel: string
		readOnly?: boolean
	}>(),
	{
		sliderStyle: 'vertical',
		labelPosition: 'left',
		readOnly: false,
		global: false
	}
)
</script>

<style lang="scss" module>
.btn {
	text-transform: uppercase;
}
</style>
