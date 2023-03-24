<template>
	<article :class="$style.wrapper" class="sf-legacies flexcol">
		<section class="legacy-tracks flexcol" :class="$style.legacyTracks">
			<LegacyTrack
				v-for="legacy in ['quests', 'bonds', 'discoveries']"
				:key="legacy"
				:actor="actor"
				:legacy="(legacy as any)"
				class="nogrow"
				:class="$style.legacyTrack" />
		</section>
		<section
			v-if="starredProgresses.length"
			:class="$style.starredProgress"
			class="starred-progress-tracks flexcol">
			<ProgressListItem
				v-for="(progressItem, i) in starredProgresses"
				:key="`progress-item-${i}`"
				:item="progressItem"
				:show-star="true"
				class="nogrow" />
		</section>
	</article>
</template>
<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, inject } from 'vue'
import LegacyTrack from '../legacy-track.vue'
import ProgressListItem from '../progress/progress-list-item.vue'
import { ActorKey } from '../../provisions.js'
import type { IronswornActor } from '../../../actor/actor'

const actor = inject(ActorKey) as Ref<IronswornActor['_source']>

const starredProgresses = computed(() =>
	// TODO: use $actor?.itemTypes.progress instead?

	actor?.value.items.filter(
		(item) => item.type === 'progress' && (item.system as any)?.starred
	)
)
</script>

<style lang="scss" module>
.wrapper {
	gap: var(--ironsworn-spacer-md);

	> *:not(:first-child) {
		border-top: var(--ironsworn-border-width-md) solid
			var(--ironsworn-color-border);
	}
}

.starredProgress {
	gap: var(--ironsworn-spacer-md);
	padding: var(--ironsworn-spacer-md) 0;
}

.legacyTracks {
	gap: var(--ironsworn-spacer-md);
	align-items: center;
}

.legacyTrack {
	width: 100%;
	height: max-content;
}
</style>
