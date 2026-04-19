<template>
	<CollapseTransition
		group
		tag="ul"
		class="progress-list item-list"
		:class="$style.list">
		<li v-for="item in items" :key="item._id" class="flexrow nogrow">
			<LedgerEntryListItem :item="item" />
		</li>
	</CollapseTransition>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import { ActorKey } from '../../provisions'
import CollapseTransition from 'component:transition/collapse-transition.vue'
import LedgerEntryListItem from './ledger-entry-list-item.vue'

const actor = inject(ActorKey) as Ref

const items = computed(() =>
	(actor.value.items as any[])
		.filter((item) => item.type === 'ledger-entry')
		.sort((a, b) => (a.sort || 0) - (b.sort || 0))
)
</script>

<style lang="scss" module>
.list {
	gap: var(--ironsworn-spacer-md);
}
</style>
