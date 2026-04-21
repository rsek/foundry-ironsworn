<template>
	<article class="ledger-list-item item-row">
		<section class="ledger-main">
			<input
				type="checkbox"
				class="nogrow"
				:checked="item.system.completed"
				:data-tooltip="item.system.completed ? $t('IRONSWORN.Spent') : $t('IRONSWORN.NotSpent')"
				@change="toggleComplete" />
			<h4 class="ledger-title">{{ item.name }}</h4>
			<ValueTrack :value-boxes="item.system.valueBoxes ?? [0,0,0,0,0]" @update="updateBoxes" />
		</section>
		<section class="ledger-controls" data-tooltip-direction="UP">
			<BtnDocDelete v-if="editMode" block :document="$item" />
			<IronBtn
				block
				icon="fa:pen-to-square"
				:tooltip="$t('IRONSWORN.Edit')"
				@click="edit" />
			<IronBtn
				v-if="editMode"
				block
				:icon="completedIcon"
				:tooltip="completedTooltip"
				@click="toggleComplete" />
		</section>
	</article>
</template>


<script lang="ts" setup>
import { computed, inject, provide } from 'vue'
import { $ActorKey, $ItemKey, ActorKey, ItemKey } from '../../provisions'
import IronBtn from '../buttons/iron-btn.vue'
import ValueTrack from './value-track.vue'
import type { IronswornItem } from '../../../item/item'
import BtnDocDelete from '../buttons/btn-doc-delete.vue'

const props = defineProps<{
	item: ItemSource<'ledger-entry'>
}>()

const actor = inject(ActorKey)
const $actor = inject($ActorKey)

const $item = $actor?.items.get(
	props.item._id as string
) as IronswornItem<'ledger-entry'>

provide(ItemKey, computed(() => $item?.toObject()) as any)
provide($ItemKey, $item as any)

const editMode = computed(() => {
	return (actor?.value.flags as any)['foundry-ironsworn']?.['edit-mode']
})
const completedIcon = computed(() => {
	return props.item.system.completed ? 'fa:circle-check' : 'fa:circle-notch'
})
const completedTooltip = computed(() => {
	const suffix = props.item.system.completed ? 'Completed' : 'NotCompleted'
	return game.i18n.localize('IRONSWORN.' + suffix)
})

function edit() {
	$item?.sheet?.render(true)
}

function updateBoxes(boxes: number[]) {
	$item?.update({ 'system.valueBoxes': boxes })
}

function toggleComplete() {
	$item?.update({ system: { completed: !props.item.system.completed } })
}
</script>

<style lang="scss" scoped>
.ledger-list-item {
	display: grid;
	grid-template-columns: 1fr max-content;
	align-items: center;
	gap: 4px;
	padding: 3px;

	.ledger-main {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--ironsworn-spacer-md);

		.ledger-title {
			margin: 0;
			line-height: 1;
			white-space: nowrap;
		}

		:deep(.value-track) {
			margin-left: auto;
		}
	}

	.ledger-controls {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;

		> * {
			aspect-ratio: 1;
		}
	}
}
</style>
