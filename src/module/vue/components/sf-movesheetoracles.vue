<template>
	<div class="flexcol" :class="$style.wrapper">
		<div class="flexrow nogrow" :class="$style.nav">
			<input
				v-model="search.q"
				type="text"
				:placeholder="
					$t('SIDEBAR.Search', { types: $t('IRONSWORN.ROLLTABLES.TypeOracle') })
				"
				@keydown.enter.prevent />
			<IronBtn
				icon="fa:xmark-circle"
				class="nogrow"
				:class="$style.btn"
				style="padding: 6px"
				@click="clearSearch" />
			<IronBtn
				icon="fa:down-left-and-up-right-to-center"
				class="nogrow"
				:class="$style.btn"
				style="padding: 6px"
				@click="$tree?.collapseAll()" />
		</div>

		<OracleTree
			class="item-list scrollable flexcol"
			ref="$tree"
			:packs="packs"
			:nodeClass="{ nogrow: true }" />

		<!-- <div class="item-list scrollable flexcol" :class="$style.list">
			<OracleTreeNode
				v-for="node in treeRoot.children"
				:key="node.displayName"
				ref="oracles"
				:node="node" />
		</div> -->
	</div>
</template>

<script setup lang="ts">
import { nextTick, provide, reactive, ref, watch } from 'vue'
import type { IOracleTreeNode } from '../../features/customoracles'
import { getOracleTreeWithCustomOracles } from '../../features/customoracles'
import { OracleTable } from '../../roll-table/oracle-table'
import { Oracles } from '../../roll-table/oracles'
import IronBtn from './buttons/iron-btn.vue'
import OracleTreeNode from './oracle-tree-node.vue'
import OracleTree from './oracle-tree/oracle-tree.vue'

const props = defineProps<{ toolset: 'ironsworn' | 'starforged' }>()
provide('toolset', props.toolset)

const packIDs: Record<(typeof props)['toolset'], string[]> = {
	ironsworn: [
		'foundry-ironsworn.ironswornoracles',
		'foundry-ironsworn.delve-oracles'
	],
	starforged: ['foundry-ironsworn.starforgedoracles']
}

const packs = packIDs[props.toolset].map((id) =>
	game.packs.get(id)
) as CompendiumCollection<
	CompendiumCollection.Metadata & { type: 'RollTable' }
>[]

const search = reactive({ q: '' })
watch(search, ({ q }) => {
	// If it's not a real regex, cancel the search
	let re
	try {
		re = new RegExp(q, 'i')
	} catch {}

	if (q && re) {
		// Walk the tree and test each name.
		// Force expanded on all parent nodes leading to a match
		const searchWalk = (node: ReactiveNode, parentMatch: boolean): boolean => {
			// Match against current name (i18n) but also aliases in Dataforged
			let thisMatch = re.test(node.displayName)
			for (const alias of node.dataforgedNode?.Aliases ?? []) {
				thisMatch ||= re.test(alias)
			}

			// Check for descendant matches
			let childMatch = false
			for (const child of node.children) {
				childMatch ||= searchWalk(child, thisMatch || parentMatch)
			}

			// Expanded if part of a tree with a match
			node.forceExpanded = parentMatch || thisMatch || childMatch
			// Hidden if not
			node.forceHidden = !node.forceExpanded

			// Pass match up to ancestors
			return thisMatch || childMatch
		}
		// searchWalk(treeRoot, false)
	} else {
		// Walk the tree setting all force flags to false
		// function resetflags(node) {
		// 	node.forceExpanded = node.forceHidden = false
		// 	for (const child of node.children) resetflags(child)
		// }
		// resetflags(treeRoot)
	}
})
function clearSearch() {
	search.q = ''
}

let $tree = ref<InstanceType<typeof OracleTree>>()

CONFIG.IRONSWORN.emitter.on('highlightOracle', async (dfid) => {
	clearSearch()
})
</script>

<style lang="scss" module>
.wrapper {
	gap: var(--ironsworn-spacer-lg);
}

.nav {
	margin-top: var(--ironsworn-spacer-lg);
}

.list {
	padding: 0 var(--ironsworn-spacer-lg);
}
</style>
