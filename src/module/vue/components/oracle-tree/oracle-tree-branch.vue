<template>
	<OracleNode
		ref="$el"
		:dfid="node.folder?.flags?.['foundry-ironsworn']?.dfid"
		:uuid="node.folder!.uuid"
		:indent="iconSize"
		:class="$style.wrapper"
		:aria-labelledby="`label-${niceId}`"
		:aria-describedby="
			node.folder?.description ? `description-${niceId}` : undefined
		">
		<template #header="{ expanded, toggle }">
			<IronBtn
				:id="`label-${niceId}`"
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
		<template #default="{ expanded }">
			<template v-if="node.folder?.description">
				<section
					:id="`description-${niceId}`"
					:class="$style.indent"
					v-html="$enrichMarkdown(node.folder?.description)" />
			</template>
			<template v-for="child in childNodes">
				<OracleTreeLeaf
					v-if="'_id' in child"
					:key="child.flags?.['foundry-ironsworn']?.dfid ?? child.uuid"
					ref="children"
					:node="child"
					:icon-size="iconSize"
					:class="$style.indent"
					@expand="handleChildExpand" />
				<oracle-tree-branch
					v-else
					:key="child.folder!.uuid"
					ref="children"
					:node="child"
					:icon-size="iconSize"
					:class="$style.indent"
					@expand="handleChildExpand" />
			</template>
		</template>
	</OracleNode>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import { FontAwesome } from '../icon/icon-common'
import OracleNode from './oracle-node.vue'
import type { IronFolder } from '../../../folder/folder'
import IronBtn from '../buttons/iron-btn.vue'
import type { OracleTable } from '../../../roll-table/oracle-table'
import OracleTreeLeaf from './oracle-tree-leaf.vue'
import FontIcon from '../icon/font-icon.vue'

const props = withDefaults(
	defineProps<{
		node: DirectoryCollectionMixin.Tree<OracleTable, OracleIndexEntry>
		iconSize?: string
	}>(),
	{ iconSize: '18px' }
)

// FIXME: workaround because FVTT sometimes generates UUIDs with [object Object] in them
// will prob break if user content gets involved
const niceId = computed(() =>
	props.node.folder?.uuid.includes('[object Object]')
		? props.node.folder?.flags?.['foundry-ironsworn']?.dfid
		: props.node.folder?.uuid
)

const childNodes = computed(
	() => [...props.node.entries, ...props.node.children]

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
) as Ref<(IronFolder<OracleTable> | OracleIndexEntry)[]>

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

defineExpose({
	collapse: $el.value?.collapse,
	expand: $el.value?.expand,
	toggle: $el.value?.toggle,
	collapseChildren
})
</script>

<style lang="scss" module>
.fontIcon {
	width: v-bind(iconSize);
	height: v-bind(iconSize);
	font-size: v-bind(iconSize);
	transition: transform calc(var(--ironsworn-transition-duration) / 2);
}

.indent {
	margin-left: v-bind(iconSize);
}

.wrapper {
}
.btn {
	text-transform: uppercase;
	line-height: 1;
}
</style>
