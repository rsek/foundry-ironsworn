<template>
	<article ref="$el" :class="$style.wrapper" :data-dfid="dfid">
		<h4 class="flexrow" :class="$style.toggleWrapper">
			<slot
				name="header"
				v-bind="{ expanded: state.expanded, expand, collapse, toggle }"></slot>
		</h4>
		<CollapseTransition>
			<div
				v-show="state.expanded"
				:class="$style.content"
				class="flexcol nogrow">
				<slot
					name="default"
					v-bind="{ expanded: state.expanded, expand, collapse, toggle }">
				</slot>
			</div>
		</CollapseTransition>
	</article>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue'

import CollapseTransition from './transition/collapse-transition.vue'

const props = withDefaults(
	defineProps<{
		dfid: string
		expanded?: boolean
	}>(),
	{ expanded: false }
)

const state = reactive({
	expanded: props.expanded,
	highlighted: false
})

const $emit = defineEmits<{
	(event: 'expand'): void
	(event: 'collapse'): void
}>()

function toggle() {
	if (state.expanded) collapse()
	else expand()
}

function collapse() {
	$emit('collapse')
	state.expanded = false
}
function expand() {
	$emit('expand')
	state.expanded = true
}

async function highlightAndScrollTo() {
	expand()
	state.highlighted = true
	await nextTick()
	$el.value?.scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	})
	setTimeout(() => {
		state.highlighted = false
	}, 2000)
}

const $el = ref<HTMLElement>()

CONFIG.IRONSWORN.emitter.on('highlightOracle', async (dfid) => {
	if (props.dfid === dfid) {
		highlightAndScrollTo()
	}
})

defineExpose({
	dfid: () => props.dfid,
	expand,
	collapse,
	toggle,
	highlightAndScrollTo
})
</script>

<style lang="scss" module>
.wrapper {
}

.toggleWrapper {
	margin: 0;
	height: min-content;
	line-height: 1;
	text-transform: uppercase;
}

.toggle {
	padding: 4px;
}

.content {
	margin: var(--ironsworn-spacer-sm);
}
</style>
