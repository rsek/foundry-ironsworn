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
				@click="collapseAll" />
		</div>

		<div class="item-list scrollable flexcol" :class="$style.list">
			<!-- TODO: this should probably have some way of handling tables that don't have a folder. put them in a custom directory, perhaps? -->
			<!-- TODO: this should respect the 'visible' property when it's not a dataforged oracle -->
			<!-- TODO: is it worth stripping down OracleFolderNode so that it doesn't actually need a folder? -->
			<template v-for="node in Oracles.getRootNodes(capitalize(props.toolset))">
				<OracleFolderNode
					v-if="node.documentName === 'Folder'"
					:key="node.id"
					ref="oracles"
					:folder-id="node.id" />
				<OracleTableNode
					v-else-if="node.documentName === 'RollTable'"
					:key="(node.id as any)"
					ref="oracles"
					:oracle-table-id="node.id" />
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, reactive, ref, watch } from 'vue'
import type { IOracleTreeNode } from '../../features/customoracles'
import { getOracleTreeWithCustomOracles } from '../../features/customoracles'
import { capitalize } from '../../helpers/util'
import { OracleTable } from '../../roll-table/oracle-table'
import { Oracles } from '../../roll-table/oracles'
import IronBtn from './buttons/iron-btn.vue'
import OracleFolderNode from './oracle-folder-node.vue'
import OracleTableNode from './oracle-table-node.vue'
import OracleTreeNode from './oracle-tree-node.vue'

const props = defineProps<{ toolset: 'ironsworn' | 'starforged' }>()
provide('toolset', props.toolset)

const tempTreeRoot = await getOracleTreeWithCustomOracles(props.toolset)

const treeRoot = reactive<IOracleTreeNode>(tempTreeRoot)
type ReactiveNode = typeof treeRoot

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
		searchWalk(treeRoot, false)
	} else {
		// Walk the tree setting all force flags to false
		function resetflags(node) {
			node.forceExpanded = node.forceHidden = false
			for (const child of node.children) resetflags(child)
		}
		resetflags(treeRoot)
	}
})
function clearSearch() {
	search.q = ''
}

const oracles = ref<InstanceType<typeof OracleTreeNode>[]>([])

function collapseAll() {
	for (const node of oracles.value) {
		node.collapse()
	}
}

CONFIG.IRONSWORN.emitter.on('highlightOracle', async (dfid) => {
	clearSearch()

	// Find the path in the data tree
	const dfOraclePath = OracleTable.findOracleWithIntermediateNodes(dfid)

	// Wait for children to be present
	while (!oracles.value) {
		await nextTick()
	}

	// Walk the component tree, expanding as we go
	let children = oracles.value
	for (const dataNode of dfOraclePath) {
		const child = children?.find((x: any) => x.dfid() === dataNode.$id)
		if (!child) break
		child.expand()
		await nextTick()
		children = child.$refs.children as any
	}
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
