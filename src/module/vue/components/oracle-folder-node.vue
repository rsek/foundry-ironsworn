<template>
	<article :class="$style.wrapper">
		<h4 class="flexrow">
			<IronBtn :text="folder?.name" @click="toggleManually()">
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
				class="flexcol"
				:class="$style.indent">
				<template v-for="child in folderChildren">
					<template v-if="child.documentName === 'Folder'">
						<oracle-folder-node
							:key="(child.id as string)"
							ref="children"
							:folder-id="(child.id as string)"
							@oracleclick="oracleclick" />
					</template>
					<template v-else-if="child.documentName === 'RollTable'">
						<OracleTableNode
							:key="(child.id as string)"
							ref="children"
							:oracle-table-id="(child.id as string)"
							@oracleclick="oracleclick" />
					</template>
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

const props = defineProps<{ folderId: string }>()

const $folder = computed(
	() => game.folders?.get(props.folderId) as IronFolder | undefined
)
const folder = computed(() => $folder.value?.toObject())

const state = reactive({
	manuallyExpanded:
		$folder.value?.getFlag('foundry-ironsworn', 'forceExpanded') ?? false,
	highlighted: false
})

const folderChildren = computed(() =>
	[
		...($folder.value!.getSubfolders() as IronFolder[]),
		...($folder.value!.contents as OracleTable[])
	].sort(
		(a: any, b: any) =>
			(b.getFlag('foundry-ironsworn', 'dataforged')?.Source?.Page ?? 0) -
			(a.getFlag('foundry-ironsworn', 'dataforged')?.Source?.Page ?? 0)
	)
)

const spacerSize = '18px'

function toggleManually() {
	state.manuallyExpanded = !state.manuallyExpanded
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
	if ($folder.value?.getFlag('foundry-ironsworn', 'dfid') === dfid) {
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
	dfid: () => $folder.value?.getFlag('foundry-ironsworn', 'dfid'),
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
