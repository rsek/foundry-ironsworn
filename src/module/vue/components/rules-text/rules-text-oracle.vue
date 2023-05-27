<template>
	<RulesText
		class="rules-text-oracle"
		:source="oracleTable.flags['foundry-ironsworn']?.dataforged?.Source"
		type="slot">
		<template #default>
			<OracleTable :oracle-table="oracleTable" />
		</template>
		<template #before-main>
			<slot name="before-main"></slot>
		</template>
		<template #after-main>
			<slot name="after-main"></slot>
		</template>
		<template #after-footer>
			<slot name="after-footer"></slot>
		</template>
	</RulesText>
</template>

<script setup lang="ts">
import RulesText from './rules-text.vue'
import OracleTable from './oracle-table.vue'
import type { RollTableDataProperties } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/rollTableData'
import { PropertiesToSource } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes'

defineProps<{
	oracleTable: PropertiesToSource<RollTableDataProperties>
}>()
</script>
