<template>
	<table class="oracle-table">
		<caption
			v-if="!noCaption && oracleTable?.description"
			v-html="enrichMarkdown(oracleTable.description ?? '')" />
		<thead>
			<tr>
				<th scope="col" class="oracle-table-column-roll-range">
					{{ $t('IRONSWORN.OracleTable.ColumnLabel.Roll') }}
				</th>
				<th scope="col" class="oracle-table-column-result-text">
					{{ $t('IRONSWORN.OracleTable.ColumnLabel.Result') }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(row, i) in oracleTable?.results" :key="row._id ?? `row${i}`">
				<td class="oracle-table-column-roll-range">
					{{ rangeString(row.range) }}
				</td>
				<td
					class="oracle-table-column-result-text"
					v-html="$enrichHtml(row.text)"></td>
			</tr>
		</tbody>
	</table>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { OracleKey } from '../../provisions'
import { enrichMarkdown } from '../../vue-plugin.js'

const oracleTable = inject(OracleKey)

defineProps<{
	noCaption?: boolean
}>()

function rangeString([low, high]: number[]) {
	if (low === high) {
		return low.toString()
	}
	return `${low}-${high}`
}
</script>

<style lang="scss" scoped>
caption,
th {
	text-align: left;
}

th,
td {
	&:first-child {
		padding-inline-start: var(--ironsworn-spacer-xs);
	}

	&:last-child {
		padding-inline-end: var(--ironsworn-spacer-xs);
	}
}
</style>
