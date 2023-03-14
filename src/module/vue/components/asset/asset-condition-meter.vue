<template>
	<div :class="$style.wrapper" class="flexrow">
		<ConditionMeter
			v-if="asset.system.track.enabled"
			slider-style="horizontal"
			:class="$style.meter"
			document-type="Item"
			attr="track.current"
			:current-value="asset.system.track.current"
			:max="asset.system.track.max"
			:min="0"
			:stat-label="asset.system.track.name"
			label-position="left"
			:read-only="readonly" />
		<div :class="$style.conditions">
			<label
				v-for="(condition, i) in asset.system.conditions"
				:key="condition.name"
				:class="$style.condition">
				<input
					type="checkbox"
					:checked="condition.ticked"
					@change="toggleCondition(i)" />
				{{ condition.name }}
			</label>
		</div>
	</div>
</template>

<script lang="ts" setup>
import ConditionMeter from 'component:resource-meter/condition-meter.vue'
import type { ComputedRef } from 'vue'
import { inject } from 'vue'
import { $ItemKey, ItemKey } from '../../provisions'

const props = defineProps<{ readonly?: boolean }>()

const $asset = inject($ItemKey)
const asset = inject(ItemKey) as ComputedRef

async function toggleCondition(idx: number) {
	const { conditions } = asset?.value.system
	conditions[idx].ticked = !conditions[idx].ticked
	await $asset?.update({ system: { conditions } })

	CONFIG.IRONSWORN.emitter.emit('globalConditionChanged', {
		name: conditions[idx].name.toLowerCase(),
		enabled: conditions[idx].ticked
	})
}
</script>

<style lang="scss" module>
@use 'mixin:text.scss';
.wrapper {
}

.meter {
	gap: var(--ironsworn-spacer-sm);

	.icon-button .button-text {
		text-align: left;
	}

	.slider-segment {
		--ironsworn-text-stroke-color: var(--ironsworn-dark-color);

		@include text.stroke;
	}
}

.conditions {
	display: flex;
	flex-direction: column;
	flex-grow: 0;
	justify-content: space-around;
	margin: var(--ironsworn-spacer-md);
}

.condition {
	--ironsworn-checkbox-size: 12px;

	flex-basis: var(--ironsworn-checkbox-size);
	margin: var(--ironsworn-border-width-md) 0;
	line-height: var(--ironsworn-checkbox-size);
	white-space: nowrap;
	font-size: x-small;

	input[type='checkbox'] {
		flex: 0 0 var(--ironsworn-checkbox-size);
		margin: 0 var(--ironsworn-spacer-sm);
		width: var(--ironsworn-checkbox-size);
		height: var(--ironsworn-checkbox-size);
		vertical-align: bottom;
	}
}
</style>