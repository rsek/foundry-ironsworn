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
			<!-- TODO: this should respect the 'visible' property when it's not a dataforged oracle -->
			<template v-for="node in rootDataNodes">
				<OracleFolderNode
					v-if="node.documentName === 'Folder'"
					v-show="isNodeVisible(node)"
					:key="node.id"
					ref="children"
					class="nogrow"
					:filter="isNodeVisible"
					:folder="node.toObject()" />
				<OracleTableNode
					v-else
					v-show="isNodeVisible(node)"
					:key="(node.id as any)"
					ref="children"
					class="nogrow"
					:oracle-table="node.toObject()" />
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, provide, reactive, ref } from 'vue'
import { capitalize } from '../../helpers/util'
import { OracleTree } from '../../roll-table/oracle-tree'
import IronBtn from './buttons/iron-btn.vue'
import OracleFolderNode from './oracle-folder-node.vue'
import OracleTableNode from './oracle-table-node.vue'

const props = defineProps<{ toolset: 'ironsworn' | 'starforged' }>()
provide('toolset', props.toolset)

const search = reactive({ q: '' })

function clearSearch() {
	search.q = ''
}

function isNodeVisible(node: OracleTree.Node) {
	if (search.q.length === 0 || filteredTreeData.value == null) return true
	return Boolean(filteredTreeData.value?.some((child) => child.id === node.id))
}

const filteredTreeData = computed(() => {
	if (search.q.length !== 0)
		return OracleTree.query(search.q, capitalize(props.toolset))
	return undefined
})

const rootDataNodes = computed(() =>
	OracleTree.getNodes(capitalize(props.toolset), true)
)

const children = ref<
	InstanceType<typeof OracleFolderNode | typeof OracleTableNode>[]
>([])

function collapseAll() {
	for (const child of children.value) {
		child.collapse()
	}
}

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
