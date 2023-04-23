<template>
	<article :class="$style.wrapper">
		<h4 class="flexrow" :class="$style.toggleWrapper">
			<BtnOracle
				:draw="() => OracleTable.ask($oracleTable.dfid ?? oracleTable._id)"
				:name="oracleTable.name"
				:text="oracleTable.name">
				<template #icon>
					<IronIcon name="oracle" :size="spacerSize" />
				</template>
			</BtnOracle>
			<IronBtn
				nogrow
				:class="$style.toggle"
				icon="fa:eye"
				@click="state.descriptionExpanded = !state.descriptionExpanded" />
		</h4>
		<CollapseTransition>
			<RulesTextOracle
				v-if="state.descriptionExpanded"
				:class="$style.content"
				@moveclick="moveclick"
				@oracleclick="oracleclick" />
		</CollapseTransition>
	</article>
</template>

<script lang="ts" setup>
import { computed, provide, reactive } from 'vue'
import type { helpers } from '../../../types/utils'
import type { IronswornItem } from '../../item/item'
import { OracleTable } from '../../roll-table/oracle-table'
import { $OracleKey, OracleKey } from '../provisions'
import BtnOracle from './buttons/btn-oracle.vue'
import IronBtn from './buttons/iron-btn.vue'
import IronIcon from './icon/iron-icon.vue'
import RulesTextOracle from './rules-text/rules-text-oracle.vue'
import CollapseTransition from './transition/collapse-transition.vue'

const props = defineProps<{
	oracleTable: helpers.SourceDataType<OracleTable>
}>()

const $oracleTable = computed(
	() =>
		game.tables?.get(
			props.oracleTable._id as string
		) as StoredDocument<OracleTable>
)

provide(
	OracleKey,
	computed(() => props.oracleTable)
)
provide($OracleKey, $oracleTable.value)

const spacerSize = '18px'

const state = reactive({
	manuallyExpanded:
		props.oracleTable.flags?.['foundry-ironsworn']?.forceExpanded ?? false,
	descriptionExpanded: false,
	highlighted: false
})

// Click on a move link: broadcast event
function moveclick(item: IronswornItem) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}

function oracleclick(dfid) {
	CONFIG.IRONSWORN.emitter.emit('highlightOracle', dfid)
}

function collapse() {
	state.manuallyExpanded = false
	state.descriptionExpanded = false
}
function expand() {
	state.manuallyExpanded = true
}

defineExpose({
	dfid: () => $oracleTable.value.dfid,
	expand,
	collapse
})
</script>

<style lang="scss" module>
.wrapper {
}

.content {
	margin: var(--ironsworn-spacer-sm);
}

.toggleWrapper {
	margin: 0;
	height: min-content;
	line-height: 1;
	text-transform: uppercase;
}

.toggle {
	padding: 4px;
}
</style>
