<template>
	<article class="value-track">
		<button
			v-for="(state, i) in valueBoxes"
			:key="`vb-${i}`"
			class="value-box"
			:data-state="state"
			type="button"
			@click.stop="toggle(i)" />
	</article>
</template>

<script setup lang="ts">
const props = defineProps<{
	valueBoxes: number[]
}>()

const emit = defineEmits<{
	(e: 'update', boxes: number[]): void
}>()

function toggle(index: number) {
	const next = [...props.valueBoxes]
	next[index] = (next[index] + 1) % 3
	emit('update', next)
}
</script>

<style lang="scss" scoped>
.value-track {
	display: flex;
	flex-direction: row;
	gap: 4px;
	align-items: center;
}

.value-box {
	width: 20px;
	height: 20px;
	min-width: 20px;
	min-height: 20px;
	border-radius: 50%;
	border: 2px solid currentColor;
	background: transparent;
	cursor: pointer;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	line-height: 1;
	color: inherit;

	&[data-state="1"]::after {
		content: "+";
	}

	&[data-state="2"] {
		background: currentColor;
	}
}
</style>
