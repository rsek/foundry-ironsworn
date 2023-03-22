<template>
	<div class="flexcol nogrow">
		<div class="flexrow">
			<h4>{{ $t('IRONSWORN.ITEMS.TypeBond') }}</h4>
			<IronBtn block nogrow icon="fa:pen-to-square" @click="editBonds" />
			<IronBtn block nogrow icon="ironsworn:d10-tilt" @click="rollBonds" />
		</div>
		<ProgressTrack
			:ticks="bondcount"
			:rank="null"
			:compact-progress="props.compactProgress" />
	</div>
</template>

<script setup lang="ts">
import { inject, computed, Ref } from 'vue'
import type { IronswornActor } from '../../actor/actor'
import type { IronswornItem } from '../../item/item'
import { $ActorKey, ActorKey } from '../provisions'
import IronBtn from './buttons/iron-btn.vue'
import ProgressTrack from './progress/progress-track.vue'

const props = defineProps<{ compactProgress?: boolean }>()

const actor = inject(ActorKey)
const $actor = inject($ActorKey) as IronswornActor<'character'> | undefined

const bonds = computed(() => {
	return actor?.value?.items.find(
		(x) => x.type === 'bondset'
	) as IronswornItem<'bondset'>['_source']
})
const bondcount = computed(() => {
	const sys = bonds.value?.system as IronswornItem<'bondset'>['system']
	if (!sys?.bonds) return 0
	return Object.values(sys.bonds).length
})

function editBonds() {
	const item = $actor?.items.get(bonds?.value?._id) as IronswornItem<'bondset'>
	item?.sheet?.render(true)
}
function rollBonds() {
	const item = $actor?.items.get(bonds?.value?._id) as IronswornItem<'bondset'>
	item?.writeEpilogue()
}
</script>

<style lang="scss" scoped>
h4 {
	text-transform: uppercase;
}
</style>
