<template>
	<div class="flexcol">
		<!-- HEADER -->
		<SheetHeaderBasic class="nogrow" :document="data.item" />

		<div
			class="flexrow nogrow"
			style="gap: 1em; margin: var(--ironsworn-spacer-lg) 0">
			<label class="checkbox nogrow">
				<input
					v-model="data.item.system.completed"
					type="checkbox"
					@change="saveChecks" />
				{{ $t('IRONSWORN.Spent') }}
			</label>
		</div>

		<hr class="nogrow" />

		<div class="flexrow nogrow" style="align-items: center; gap: var(--ironsworn-spacer-md); margin-bottom: 1em">
			<h4 style="margin: 0">{{ $t('IRONSWORN.TREASURY.ValueTrack') }}</h4>
			<ValueTrack :value-boxes="data.item.system.valueBoxes ?? [0,0,0,0,0]" @update="updateBoxes" />
		</div>

		<hr class="nogrow" />
		<RichEditor v-model="data.item.system.description" @save="saveDescription" />
		<BtnDocDelete
			nogrow
			block
			:class="$style.danger"
			:btn-text="true"
			:document="$item" />
	</div>
</template>

<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import { $ItemKey, ItemKey } from './provisions'
import RichEditor from './components/rich-editor.vue'
import SheetHeaderBasic from './sheet-header-basic.vue'
import ValueTrack from './components/ledger/value-track.vue'
import type { IronswornItem } from '../item/item'
import BtnDocDelete from './components/buttons/btn-doc-delete.vue'

const props = defineProps<{ data: { item: ItemSource<'ledger-entry'> } }>()
const $item = inject($ItemKey) as IronswornItem<'ledger-entry'>

provide(
	ItemKey,
	computed(() => props.data.item)
)

function updateBoxes(boxes: number[]) {
	$item?.update({ 'system.valueBoxes': boxes })
}

function saveChecks() {
	$item?.update({
		system: {
			completed: props.data.item.system.completed
		}
	})
}

function saveDescription() {
	$item?.update({ system: { description: props.data.item.system.description } })
}
</script>

<style lang="scss" module>
.danger {
	--ironsworn-color-clickable-block-border: var(--ironsworn-color-danger);
	--ironsworn-color-clickable-block-fg: var(--ironsworn-color-danger);
	--ironsworn-color-clickable-block-bg: transparent;
	--ironsworn-color-clickable-block-border-hover: var(--ironsworn-color-danger);
	--ironsworn-color-clickable-block-fg-hover: var(--ironsworn-color-light);
	--ironsworn-color-clickable-block-bg-hover: var(--ironsworn-color-danger);

	margin: var(--ironsworn-spacer-md) 0 0;
	border-width: var(--ironsworn-border-width-lg);
	border-style: solid;
	border-radius: var(--ironsworn-border-radius-lg);
	color: var(--ironsworn-color-danger);
}
</style>
