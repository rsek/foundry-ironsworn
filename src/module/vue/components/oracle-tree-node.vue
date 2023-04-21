<template>
	<div
		ref="$el"
		class="flexcol nogrow movesheet-row"
		:class="{ highlighted: state.highlighted }"
		data-tooltip-direction="LEFT"
		:data-tourid="`oracle-${$node?.getFlag('dataforged', '$id')}`">
		<!-- TODO: split this into two components, yo -->
		<!-- Leaf node -->
		<div v-if="$node?.documentName === 'RollTable'">
			<h4 class="flexrow">
				<BtnOracle :draw="$node.draw" :name="node.name">
					<template #icon>
						<IronIcon name="oracle" :size="spacerSize" />
					</template>
				</BtnOracle>
				<IronBtn
					nogrow
					class="show-oracle-info"
					icon="fa:eye"
					@click="state.expanded = !state.expanded" />
			</h4>
			<CollapseTransition>
				<RulesTextOracle
					v-if="state.expanded"
					:class="$style.content"
					@moveclick="moveclick"
					@oracleclick="oracleclick" />
			</CollapseTransition>
		</div>

		<!-- Branch node -->
		<div v-else>
			<h4 class="flexrow">
				<IronBtn :text="node.name" @click="state.expanded = !state.expanded">
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
			</h4>

			<CollapseTransition>
				<div v-show="state.expanded" class="flexcol" :class="$style.indent">
					<oracle-tree-node
						v-for="child in $node?.contents"
						:key="(child.id as string)"
						ref="children"
						:node="(child as OracleTable | IronFolder).toObject()"
						@oracleclick="oracleclick" />
				</div>
			</CollapseTransition>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { FontAwesome } from './icon/icon-common'
import BtnOracle from './buttons/btn-oracle.vue'
import type { IronswornItem } from '../../item/item'
import RulesTextOracle from './rules-text/rules-text-oracle.vue'
import CollapseTransition from './transition/collapse-transition.vue'
import IronBtn from './buttons/iron-btn.vue'
import FontIcon from './icon/font-icon.vue'
import IronIcon from './icon/iron-icon.vue'
import { OracleTable } from '../../roll-table/oracle-table'
import { IronFolder } from '../../folder/folder'
import type { helpers } from '../../../types/utils'

const props = defineProps<{
	node: helpers.SourceDataType<OracleTable | IronFolder>
}>()

const $node =
	game.tables?.get(props.node._id as string) ??
	game.folders?.get(props.node._id as string)

const spacerSize = '18px'

const state = reactive({ highlighted: false, expanded: false })

// Click on a move link: broadcast event
function moveclick(item: IronswornItem) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}

function oracleclick(dfid) {
	CONFIG.IRONSWORN.emitter.emit('highlightOracle', dfid)
}

const children = ref([] as any[])

function collapse() {
	state.expanded = false
	for (const child of children.value ?? []) {
		child.collapse()
	}
}
function expand() {
	state.expanded = true
}

const $el = ref<HTMLElement>()
CONFIG.IRONSWORN.emitter.on('highlightOracle', (dfid) => {
	if ($node?.getFlag('dataforged', '$id') === dfid) {
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
	dfid: () => $node?.getFlag('dataforged', '$id'),
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
</style>

<style lang="scss" scoped>
.show-oracle-info {
	// padding: 4px;
}

.movesheet-row {
	transition: all 0.4s ease;
}

h4 {
	margin: 0;
	height: min-content;
	line-height: 1;

	button {
		height: min-content;
		text-transform: uppercase;
		line-height: 1;
	}
}

.hidden {
	display: none;
}
</style>
