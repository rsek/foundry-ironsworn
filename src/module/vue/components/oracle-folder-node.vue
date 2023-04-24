<template>
	<article :class="$style.wrapper">
		<h4 class="flexrow" :class="$style.toggleWrapper">
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
							state.manuallyExpanded ? FontAwesome.Rotate['90deg'] : undefined
						" />
				</template>
			</IronBtn>
		</h4>

		<CollapseTransition>
			<div
				v-show="state.manuallyExpanded"
				class="flexcol nogrow"
				:class="$style.indent">
				<template v-for="node in childrenData">
					<oracle-folder-node
						v-if="node.documentName === 'Folder'"
						v-show="isNodeVisible(node)"
						:key="(node.id as string)"
						ref="treeNodes"
						class="nogrow"
						:filter="isNodeVisible"
						:folder="node.toObject()"
						@oracleclick="oracleclick"
						@moveclick="moveclick" />
					<OracleTableNode
						v-else
						v-show="isNodeVisible(node)"
						:key="(node.id as any)"
						ref="treeNodes"
						class="nogrow"
						:oracle-table="node.toObject()"
						@oracleclick="oracleclick"
						@moveclick="moveclick" />
				</template>
			</div>
		</CollapseTransition>
	</article>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { FontAwesome } from './icon/icon-common'
import CollapseTransition from './transition/collapse-transition.vue'
import IronBtn from './buttons/iron-btn.vue'
import FontIcon from './icon/font-icon.vue'
import type { IronFolder } from '../../folder/folder'
import type { OracleTable } from '../../roll-table/oracle-table'
import OracleTableNode from './oracle-table-node.vue'
import type { helpers } from '../../../types/utils'
import type { OracleTree } from '../../roll-table/oracle-tree'
import { IronswornItem } from '../../item/item'

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
	manuallyExpanded:
		$folder.value.getFlag('foundry-ironsworn', 'forceExpanded') ?? false,
	highlighted: false
})

const spacerSize = '18px'

function toggleManually() {
	state.manuallyExpanded = !state.manuallyExpanded
}

// Click on a move link: broadcast event
function moveclick(item: IronswornItem) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}
function oracleclick(dfid) {
	CONFIG.IRONSWORN.emitter.emit('highlightOracle', dfid)
}

const children = ref([] as any[])

function collapse() {
	state.manuallyExpanded = false
	for (const child of children.value ?? []) {
		child.collapse()
	}
}
function expand() {
	state.manuallyExpanded = true
}

const $el = ref<HTMLElement>()
CONFIG.IRONSWORN.emitter.on('highlightOracle', (dfid) => {
	if (dfid.startsWith($folder.value.dfid as string))
		// inference: target dfid is a descendent of this folder node
		expand()
	if ($folder.value.dfid === dfid) {
		state.highlighted = true
		$el.value?.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
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
