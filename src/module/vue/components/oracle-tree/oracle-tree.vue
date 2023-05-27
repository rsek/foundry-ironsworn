<template>
	<article :class="$style.wrapper">
		<template v-for="node of nodes">
			<OracleTreeLeaf
				v-if="'_id' in node"
				:key="node.flags?.['foundry-ironsworn']?.dfid ?? node.uuid"
				:node="node" />
			<OracleTreeBranch
				v-else-if="node.folder != null"
				:key="node.folder.uuid"
				:node="node" />
		</template>
	</article>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import OracleTreeBranch from './oracle-tree-branch.vue'
import OracleTreeLeaf from './oracle-tree-leaf.vue'

const props = defineProps<{
	packs: CompendiumCollection<
		CompendiumCollection.Metadata & { type: 'RollTable' }
	>[]
}>()

const nodes = computed(() =>
	props.packs
		.flatMap((pack) => [...pack.tree.entries, ...pack.tree.children])
		.sort((a, b) =>
			CompendiumCollection._sortStandard(
				{
					sort: '_id' in a ? a.sort : a.folder?.sort ?? 0
				},
				{
					sort: '_id' in b ? b.sort : b.folder?.sort ?? 0
				}
			)
		)
)
</script>

<style lang="scss" module>
.wrapper {
}
</style>
