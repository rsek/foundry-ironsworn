<template>
	<RulesText
		class="rules-text-oracle"
		:source="oracleTable?.flags?.['foundry-ironsworn']?.dataforged?.Source"
		type="slot">
		<template #default>
			<OracleTable />
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
import { OracleKey } from '../../provisions'
import { inject } from 'vue'

const oracleTable = inject(OracleKey)
</script>
