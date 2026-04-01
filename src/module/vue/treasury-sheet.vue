<template>
	<SheetBasic :document="data.actor" class="shared-sheet" body-class="flexcol">
		<section class="treasury-header nogrow flexrow" style="gap: var(--ironsworn-spacer-xl)">
			<section class="flexcol" style="max-width: 75%">
				<label class="flexcol">
					<span>{{ $t('IRONSWORN.TREASURY.Ship') }}</span>
					<input ref="shipInput" type="text" :value="data.actor.system.ship" @change="saveShip" />
				</label>
				<label class="flexcol" style="margin-top: var(--ironsworn-spacer-lg)">
					<span>{{ $t('IRONSWORN.TREASURY.Commander') }}</span>
					<input ref="commanderInput" type="text" :value="data.actor.system.commander" @change="saveCommander" />
				</label>
			</section>
			<section class="nogrow flexcol" style="margin-left: auto; align-self: flex-start">
				<label class="flexcol">
					<span>{{ $t('IRONSWORN.TREASURY.Upkeep') }}</span>
					<input ref="upkeepInput" type="text" :value="data.actor.system.upkeep" style="text-align: center; min-height: 4rem" @change="saveUpkeep" />
				</label>
			</section>
		</section>
		<section class="flexcol" style="margin-top: var(--ironsworn-spacer-lg)">
<LedgerEntryList class="nogrow" />
			<div class="flexrow nogrow">
				<IronBtn block icon="fa:plus" :text="$t('IRONSWORN.ITEM.TypeLedgerEntry')" @click="addProgressItem" />
			</div>
			<section class="sheet-area flexcol">
				<h4 class="nogrow">{{ $t('Notes') }}</h4>
				<RichEditor v-model="data.actor.system.biography" @save="saveNotes" />
			</section>
		</section>
	</SheetBasic>
</template>

<script setup lang="ts">
import { provide, computed, inject, ref } from 'vue'
import { $ActorKey, ActorKey } from './provisions'
import SheetBasic from './sheet-basic.vue'
import IronBtn from 'component:buttons/iron-btn.vue'
import LedgerEntryList from './components/ledger/ledger-entry-list.vue'
import RichEditor from './components/rich-editor.vue'

const props = defineProps<{
	data: { actor: ActorSource<'treasury'> }
}>()
provide(ActorKey, computed(() => props.data.actor) as any)
const $actor = inject($ActorKey)

const shipInput = ref<HTMLInputElement | null>(null)
const commanderInput = ref<HTMLInputElement | null>(null)
const upkeepInput = ref<HTMLInputElement | null>(null)

function saveShip() {
	$actor?.update({ 'system.ship': shipInput.value?.value })
}
function saveCommander() {
	$actor?.update({ 'system.commander': commanderInput.value?.value })
}
function saveUpkeep() {
	$actor?.update({ 'system.upkeep': upkeepInput.value?.value })
}

function saveNotes() {
	$actor?.update({ 'system.biography': props.data.actor.system.biography })
}

async function addProgressItem() {
	const item = await Item.create(
		{ name: 'Ledger Entry', type: 'ledger-entry', sort: 9000000 } as any,
		{ parent: $actor }
	)
	item?.sheet?.render(true)
}


</script>

