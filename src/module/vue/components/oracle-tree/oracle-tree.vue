<template>
	<article :class="$style.wrapper">
		<template v-for="node of nodes">
			<OracleTreeLeaf
				v-if="'_id' in node"
				:class="nodeClass"
				:key="node.flags?.['foundry-ironsworn']?.dfid ?? node.uuid"
				:node="node"
				ref="children" />
			<OracleTreeBranch
				v-else-if="node.folder != null"
				:class="nodeClass"
				:key="node.folder.uuid"
				:node="node"
				ref="children" />
		</template>
	</article>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import OracleTreeBranch from './oracle-tree-branch.vue'
import OracleTreeLeaf from './oracle-tree-leaf.vue'

const props = defineProps<{
	nodeClass?: any
	packs: CompendiumCollection<
		CompendiumCollection.Metadata & { type: 'RollTable' }
	>[]
}>()

const nodes = computed(
	() =>
		props.packs.flatMap((pack) => [...pack.tree.entries, ...pack.tree.children])
	// .sort((a, b) =>
	// 	CompendiumCollection._sortStandard(
	// 		{
	// 			sort: '_id' in a ? a.sort : a.folder?.sort ?? 0
	// 		},
	// 		{
	// 			sort: '_id' in b ? b.sort : b.folder?.sort ?? 0
	// 		}
	// 	)
	// )
)

const children =
	ref<
		(
			| InstanceType<typeof OracleTreeLeaf>
			| InstanceType<typeof OracleTreeBranch>
		)[]
	>()

defineExpose({
	collapseAll: () => {
		// if (children.value == null) return
		console.log('collapseAll')

		for (const child of children.value ?? []) {
			console.log(child)
			child?.$node?.collapse?.()
		}
	}
})
</script>

<style lang="scss" module>
.wrapper {
}
</style>
