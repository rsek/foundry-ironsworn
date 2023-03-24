<template>
	<IronBtn
		class="burn-momentum"
		:tooltip="tooltip"
		icon="fa:fire"
		v-bind="($props, $attrs)"
		@click="burnMomentum">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import type { ExtractPropTypes } from 'vue'
import { $ActorKey } from '../../provisions'
import IronBtn from './iron-btn.vue'
import type { IronswornActor } from '../../../actor/actor'

interface Props extends Omit<ExtractPropTypes<typeof IronBtn>, 'tooltip'> {}

defineProps<Props>()
const $actor = inject($ActorKey) as IronswornActor<'character'> | undefined

const tooltip = computed(() => {
	return game.i18n.format('IRONSWORN.BurnMomentumAndResetTo', {
		value: $actor?.system.momentum ?? null,
		resetValue: $actor?.system.momentumReset ?? null
	})
})

const burnMomentum = () => $actor?.burnMomentum()
</script>
