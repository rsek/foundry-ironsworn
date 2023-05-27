<template>
	<OracleNode
		ref="$el"
		:dfid="node.folder?.flags?.['foundry-ironsworn']?.dfid"
		:uuid="node.folder!.uuid"
		:class="$style.wrapper">
		<template #header="{ expanded, toggle }">
			<IronBtn
				:class="$style.btn"
				:text="(node.folder!.name as string)"
				@click="toggle">
				<template #icon>
					<FontIcon
						nogrow
						:class="$style.fontIcon"
						name="caret-right"
						:rotate="expanded ? FontAwesome.Rotate['90deg'] : undefined" />
				</template>
			</IronBtn>
		</template>
		<template #default>
			<template v-if="node.folder?.description">
				<p>{{ node.folder?.description }}</p>
			</template>
			<template v-for="child in childNodes">
				<OracleTreeLeaf
					v-if="'_id' in child"
					:key="child.flags?.['foundry-ironsworn']?.dfid ?? child.uuid"
					ref="children"
					:class="$style.indent"
					:node="child"
					@expand="handleChildExpand" />
				<oracle-tree-branch
					v-else
					:key="child.folder!.uuid"
					ref="children"
					:class="$style.indent"
					:node="child"
					@expand="handleChildExpand" />
			</template>
		</template>
	</OracleNode>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from 'vue'
import { FontAwesome } from '../icon/icon-common'
import OracleNode from './oracle-node.vue'
import { IronFolder } from '../../../folder/folder'
import IronBtn from '../buttons/iron-btn.vue'
import FontIconStack from '../icon/font-icon-stack.vue'
import type { OracleTable } from '../../../roll-table/oracle-table'
import OracleTreeLeaf from './oracle-tree-leaf.vue'
import type { IndexEntry } from '../../../../types/directory-collection'
import FontIcon from '../icon/font-icon.vue'

const props = defineProps<{
	node: DirectoryCollectionMixin.Tree<OracleTable, OracleIndexEntry>
}>()

const spacerSize = '18px'

const childNodes = computed(() =>
	[...props.node.entries, ...props.node.children].sort((a, b) =>
		CompendiumCollection._sortStandard(
			{
				sort: '_id' in a ? a.sort : a.folder?.sort ?? 0
			},
			{
				sort: '_id' in b ? b.sort : b.folder?.sort ?? 0
			}
		)
	)
) as Ref<(IronFolder<OracleTable> | OracleIndexEntry)[]>

let $el = ref<InstanceType<typeof OracleNode>>()

const children = ref<InstanceType<typeof OracleNode>[]>([])

function handleChildExpand() {
	$el.value?.expand()
}

function collapseChildren() {
	for (const child of children.value ?? []) {
		child.collapse()
	}
}

defineExpose({
	collapse: $el.value?.collapse,
	expand: $el.value?.expand,
	toggle: $el.value?.toggle,
	collapseChildren
})
</script>

<style lang="scss" module>
.indent {
	margin-left: v-bind(spacerSize);
}

.fontIcon {
	width: v-bind(spacerSize);
	height: v-bind(spacerSize);
	font-size: v-bind(spacerSize);
}

.wrapper {
}
.btn {
	height: min-content;
	text-transform: uppercase;
	line-height: 1;
}
</style>
