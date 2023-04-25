<template>
	<OracleNode
		:class="$style.wrapper"
		:dfid="$folder.dfid ?? $folder.id"
		:expanded="props.folder.flags?.['foundry-ironsworn']?.forceExpanded">
		<template #header="{ toggle }">
			<IronBtn
				:text="folder.name"
				:class="$style.toggle"
				@click="toggleManually()">
				<template #icon>
					<FontIcon
						nogrow
						:class="$style.fontIcon"
						name="caret-right"
						:rotate="
							state.expanded ? FontAwesome.Rotate['90deg'] : undefined
						" />
				</template>
			</IronBtn>
		</template>
		<template #default>
			<template v-for="node in childrenData">
				<oracle-folder-node
					v-if="node.documentName === 'Folder'"
					v-show="isNodeVisible(node)"
					:key="(node.id as string)"
					ref="children"
					class="nogrow"
					:filter="isNodeVisible"
					:folder="node.toObject()"
					@expand="expand"
					@oracleclick="oracleclick"
					@moveclick="moveclick" />
				<OracleTableNode
					v-else
					v-show="isNodeVisible(node)"
					:key="(node.id as any)"
					ref="children"
					class="nogrow"
					:oracle-table="node.toObject()"
					@expand="expand"
					@oracleclick="oracleclick"
					@moveclick="moveclick" />
			</template>
		</template>
	</OracleNode>
</template>

<script lang="ts" setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { FontAwesome } from './icon/icon-common'
import IronBtn from './buttons/iron-btn.vue'
import FontIcon from './icon/font-icon.vue'
import type { IronFolder } from '../../folder/folder'
import type { OracleTable } from '../../roll-table/oracle-table'
import OracleTableNode from './oracle-table-node.vue'
import type { helpers } from '../../../types/utils'
import type { OracleTree } from '../../roll-table/oracle-tree'
import type { IronswornItem } from '../../item/item'
import OracleNode from './oracle-node.vue'

const props = defineProps<{
	folder: helpers.SourceDataType<IronFolder>
	filter?: (node: OracleTree.Node) => boolean
}>()

const $folder = computed(
	() => game.folders?.get(props.folder._id as string) as IronFolder<OracleTable>
)

function isNodeVisible(node: OracleTree.Node) {
	if (props.filter == null) return true
	return props.filter(node)
}

const childrenData = computed(() =>
	[...$folder.value.getSubfolders(false), ...$folder.value.contents].sort(
		(a, b) => a.sort - b.sort
	)
)

const state = reactive({
	expanded:
		$folder.value.getFlag('foundry-ironsworn', 'forceExpanded') ?? false,
	highlighted: false
})

const spacerSize = '18px'

function toggleManually() {
	state.expanded = !state.expanded
}

// Click on a move link: broadcast event
function moveclick(item: IronswornItem) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}
function oracleclick(dfid) {
	CONFIG.IRONSWORN.emitter.emit('highlightOracle', dfid)
}

const children = ref([] as any[])

const $emit = defineEmits<{
	(event: 'expand'): void
	(event: 'collapse'): void
}>()

function collapse() {
	$emit('collapse')
	state.expanded = false
	for (const child of children.value ?? []) {
		child.collapse()
	}
}

function expand() {
	$emit('expand')
	state.expanded = true
}

const $el = ref<HTMLElement>()

CONFIG.IRONSWORN.emitter.on('highlightOracle', async (dfid) => {
	if ($folder.value.dfid === dfid) {
		expand()
		state.highlighted = true
		await nextTick()
		$el.value?.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		})
		setTimeout(() => {
			state.highlighted = false
		}, 2000)
	}
})

defineExpose({
	dfid: () => $folder.value.dfid,
	expand,
	collapse
})
</script>

<style lang="scss" module>
.content {
	margin: var(--ironsworn-spacer-sm);
}

.indent {
	margin-left: v-bind(spacerSize);
}

.fontIcon {
	width: v-bind(spacerSize);
	height: v-bind(spacerSize);
	font-size: v-bind(spacerSize);
}
.toggleWrapper {
	margin: 0;
	height: min-content;
	line-height: 1;
	text-transform: uppercase;
}
.toggle {
	height: min-content;
	text-transform: inherit;
	line-height: 1;
}
</style>
