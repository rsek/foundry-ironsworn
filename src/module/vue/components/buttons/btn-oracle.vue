<template>
	<IronBtn
		class="oracle-roll"
		:tooltip="$t('IRONSWORN.RollOracleTable', { title: name })"
		icon="ironsworn:oracle"
		v-bind="($props, $attrs)"
		@click="rollOracle">
		<template v-for="(_, slot) of $slots" #[slot]="scope">
			<slot :name="slot" v-bind="scope" />
		</template>
	</IronBtn>
</template>

<script setup lang="ts">
import type { ExtractPropTypes } from 'vue'
import IronBtn from './iron-btn.vue'

interface Props extends Omit<ExtractPropTypes<typeof IronBtn>, 'tooltip'> {
	name: string
	/** The oracle function executed on click */
	draw: (options?: RollTable.DrawOptions) => Promise<void | RollTableDraw>
}

const props = defineProps<Props>()

async function rollOracle() {
	if (props.disabled) return
	return props.draw()
}
</script>
