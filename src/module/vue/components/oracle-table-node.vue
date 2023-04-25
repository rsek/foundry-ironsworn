<template>
	<OracleNode
		:dfid="$oracleTable.dfid ?? $oracleTable.id"
		:expanded="props.oracleTable.flags?.['foundry-ironsworn']?.forceExpanded">
		<template #header="{ toggle }">
			<BtnOracle
				:draw="() => OracleTable.ask($oracleTable.dfid ?? $oracleTable.id)"
				:name="oracleTable.name"
				:text="oracleTable.name">
				<template #icon>
					<IronIcon name="oracle" :size="spacerSize" />
				</template>
			</BtnOracle>
			<IronBtn nogrow :class="$style.toggle" icon="fa:eye" @click="toggle" />
		</template>
		<template #default>
			<RulesTextOracle
				:class="$style.content"
				@moveclick="moveclick"
				@oracleclick="oracleclick" />
		</template>
	</OracleNode>
</template>

<script lang="ts" setup>
import { computed, provide, ref } from 'vue'
import type { helpers } from '../../../types/utils'
import type { IronswornItem } from '../../item/item'
import { OracleTable } from '../../roll-table/oracle-table'
import { $OracleKey, OracleKey } from '../provisions'
import BtnOracle from './buttons/btn-oracle.vue'
import IronBtn from './buttons/iron-btn.vue'
import IronIcon from './icon/iron-icon.vue'
import OracleNode from './oracle-node.vue'
import RulesTextOracle from './rules-text/rules-text-oracle.vue'

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

// Click on a move link: broadcast event
function moveclick(item: IronswornItem) {
	CONFIG.IRONSWORN.emitter.emit('highlightMove', item.uuid)
}

function oracleclick(dfid) {
	CONFIG.IRONSWORN.emitter.emit('highlightOracle', dfid)
}
</script>

<style lang="scss" module>
.toggle {
	padding: 4px;
}
</style>
