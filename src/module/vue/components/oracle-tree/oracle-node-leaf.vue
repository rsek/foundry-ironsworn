<template>
	<OracleNode
		:dfid="node.flags['foundry-ironsworn']?.dfid ?? node.uuid"
		:class="$style.wrapper"
		@mouseenter="cacheOracle"
		@focus="cacheOracle">
		<template #header="{ toggle }">
			<BtnOracle :name="node?.name" :oracle-id="node?.uuid" :text="node?.name">
				<template #icon>
					<IronIcon name="oracle" :size="spacerSize" />
				</template>
			</BtnOracle>
			<IronBtn
				nogrow
				class="show-oracle-info"
				icon="fa:eye"
				@click="cacheAndToggle(toggle)" />
		</template>
		<template #default="{ expanded }">
			<template v-if="expanded">
				<RulesTextOracle
					:oracle-table="state.oracleTable"
					:class="$style.content"
					@moveclick="moveclick"
					@oracleclick="oracleclick" />
			</template>
		</template>
	</OracleNode>
</template>

<script lang="ts" setup>
import type { RollTableDataProperties } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import type { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import { nextTick, reactive } from 'vue'
import type { IndexEntry } from '../../../../types/compendium'
import type { IronswornItem } from '../../../item/item'
import type { OracleTable } from '../../../roll-table/oracle-table'
import BtnOracle from '../buttons/btn-oracle.vue'
import IronBtn from '../buttons/iron-btn.vue'
import IronIcon from '../icon/iron-icon.vue'
import RulesTextOracle from '../rules-text/rules-text-oracle.vue'
import OracleNode from './oracle-node.vue'

const props = defineProps<{ node: IndexEntry<OracleTable> }>()
const spacerSize = '18px'

const state = reactive<{
	descriptionExpanded: boolean
	oracleTable: PropertiesToSource<RollTableDataProperties>
}>({
	descriptionExpanded: false,
	oracleTable: null as any
})

/** Retrieves and caches the OracleTable source object; fires on mouseenter and focus */
async function cacheOracle() {
	if (state.oracleTable == null) {
		const $table = (await fromUuid(props.node.uuid)) as OracleTable
		state.oracleTable = $table.toObject()
		await nextTick()
	}
	return state.oracleTable
}

async function cacheAndToggle(toggleFn: () => void) {
	await cacheOracle()
	toggleFn()
}

// Click on a move link: broadcast event
function moveclick(item: IronswornItem) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}

function oracleclick(dfid) {
	CONFIG.IRONSWORN.emitter.emit('highlightOracle', dfid)
}

defineExpose({
	cacheOracle
})
</script>

<style lang="scss" module>
.wrapper {
}
</style>
