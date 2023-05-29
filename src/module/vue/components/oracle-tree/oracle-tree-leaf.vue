<template>
	<OracleNode
		ref="$node"
		:dfid="node.flags['foundry-ironsworn']?.dfid"
		:uuid="node.uuid"
		:class="$style.wrapper"
		:indent="iconSize"
		:aria-labelledby="`label-${niceId}`"
		@mouseenter="cacheOracle"
		@focus="cacheOracle">
		<template #header="{ toggle }">
			<BtnOracle
				:id="`label-${niceId}`"
				:name="node.name"
				:oracle-id="node.flags['foundry-ironsworn']?.dfid ?? node.uuid"
				:text="node.name">
				<template #icon>
					<IronIcon name="oracle" :size="iconSize" />
				</template>
			</BtnOracle>
			<IronBtn
				nogrow
				class="show-oracle-info"
				icon="fa:eye"
				@click="cacheAndToggle(toggle)" />
		</template>
		<template #default="{ expanded }">
			<CollapseTransition>
				<RulesTextOracle
					v-if="expanded"
					:oracle-table="state.oracleTable"
					:class="$style.content"
					@moveclick="moveclick"
					@oracleclick="oracleclick" />
			</CollapseTransition>
		</template>
	</OracleNode>
</template>

<script lang="ts" setup>
import type { RollTableDataProperties } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import type { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'
import { computed, nextTick, reactive, ref } from 'vue'
import type { IndexEntry } from '../../../../types/directory-collection'
import type { IronswornItem } from '../../../item/item'
import type { OracleTable } from '../../../roll-table/oracle-table'
import BtnOracle from '../buttons/btn-oracle.vue'
import IronBtn from '../buttons/iron-btn.vue'
import IronIcon from '../icon/iron-icon.vue'
import RulesTextOracle from '../rules-text/rules-text-oracle.vue'
import CollapseTransition from '../transition/collapse-transition.vue'
import OracleNode from './oracle-node.vue'

const props = withDefaults(
	defineProps<{
		node: IndexEntry<OracleTable>
		iconSize?: string
	}>(),
	{ iconSize: '18px' }
)

const state = reactive<{
	oracleTable: PropertiesToSource<RollTableDataProperties>
}>({
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

// FIXME: workaround because FVTT sometimes generates UUIDs with [object Object] in them
// will prob break if user content gets involved
const niceId = computed(() =>
	props.node.uuid.includes('[object Object]')
		? props.node.flags?.['foundry-ironsworn']?.dfid
		: props.node.uuid
)

async function cacheAndToggle(toggleFn: () => void) {
	console.log($node.value)

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

const $node = ref<InstanceType<typeof OracleNode>>()

defineExpose({
	$node: $node.value,
	cacheOracle
})
</script>

<style lang="scss" module>
.wrapper {
}
.content {
	padding: 0 var(--ironsworn-spacer-md);
}
</style>
