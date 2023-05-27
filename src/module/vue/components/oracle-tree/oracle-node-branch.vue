<template>
	<OracleNode
		ref="$el"
		:dfid="node.folder?.dfid ?? node.folder!.uuid"
		:class="$style.wrapper"
		@collapse="collapseChildren">
		<template #header="{ expanded, toggle }">
			<IronBtn
				:class="$style.btn"
				:text="(node.folder!.name as string)"
				:tooltip="node.folder!.description"
				@click="toggle">
				<template #icon>
					<FontIconStack
						nogrow
						:class="$style.fontIcon"
						name="caret-right"
						:rotate="expanded ? FontAwesome.Rotate['90deg'] : undefined" />
				</template>
			</IronBtn>
		</template>
		<template #default>
			<template v-for="member in contents">
				<OracleNodeLeaf
					v-if="'formula' in member"
					:key="member.uuid"
					ref="children"
					:class="$style.indent"
					:node="member"
					@expand="handleChildExpand" />
				<oracle-node-branch
					v-else
					:key="member.folder!.uuid"
					ref="children"
					:class="$style.indent"
					:node="member"
					@expand="handleChildExpand" />
			</template>
		</template>
	</OracleNode>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FontAwesome } from '../icon/icon-common'
import OracleNode from './oracle-node.vue'
import { IronFolder } from '../../../folder/folder'
import OracleNodeLeaf from './oracle-node-leaf.vue'
import IronBtn from '../buttons/iron-btn.vue'
import FontIconStack from '../icon/font-icon-stack.vue'
import type { OracleTable } from '../../../roll-table/oracle-table'
import type { IndexEntry } from '../../../../types/compendium'

const props = defineProps<{
	node: DirectoryCollectionMixin.Tree<OracleTable, OracleIndexEntry>
}>()

const spacerSize = '18px'

const contents = computed(() =>
	[...props.node.children, ...props.node.entries].sort((a, b) => {
		const [sortA, sortB] = [a, b].map((node) => {
			if (node.folder instanceof IronFolder) return node.folder.sort
			else return (node as IndexEntry<OracleTable>).sort
		})
		return sortA - sortB
	})
)

const $el = ref<InstanceType<typeof OracleNode>>()

const children = ref<InstanceType<typeof OracleNode>[]>([])

function handleChildExpand() {
	$el.value?.expand()
}

function collapseChildren() {
	for (const child of children.value ?? []) {
		child.collapse()
	}
}
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
