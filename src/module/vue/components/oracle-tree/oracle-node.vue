<template>
	<article
		ref="$el"
		:data-dfid="dfid"
		:data-uuid="uuid"
		:class="{
			[$style.wrapper]: true,
			highlighted: state.highlighted
		}">
		<header class="flexrow" :class="$style.header">
			<slot
				name="header"
				v-bind="{
					expanded: state.expanded,
					toggle
				}" />
		</header>
		<CollapseTransition>
			<section v-show="state.expanded" class="flexcol" :class="$style.content">
				<slot
					name="default"
					v-bind="{
						expanded: state.expanded
					}" />
			</section>
		</CollapseTransition>
	</article>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import CollapseTransition from '../transition/collapse-transition.vue'

// TODO: rewrite the highlight as a CSS animation rather than requiring a JS callback

/** Handles features common to all kinds of oracle nodes */
const props = withDefaults(
	defineProps<{
		expanded?: boolean
		dfid?: string
		indent?: string
		uuid: string
		collapsedHeight?: string
	}>(),
	{
		expanded: false,
		dfid: undefined,
		indent: '18px',
		collapsedHeight: '25px'
	}
)

const state = reactive({
	expanded: props.expanded,
	highlighted: false
})

function toggle() {
	state.expanded ? collapse() : expand()
}
function collapse() {
	if (!state.expanded) return
	$emit('collapse')
	state.expanded = false
}
function expand() {
	if (state.expanded) return
	$emit('expand')
	state.expanded = true
}

const $emit = defineEmits<{
	(e: 'expand'): void
	(e: 'collapse'): void
}>()

const $el = ref<HTMLElement>()

CONFIG.IRONSWORN.emitter.on('highlightOracle', (id) => {
	if (props.dfid === id || props.uuid === id) {
		state.highlighted = true
		$el.value?.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		})
		setTimeout(() => {
			state.highlighted = false
		}, 2000)
	}
})

defineExpose({
	dfid: () => props.dfid,
	expand,
	collapse,
	toggle
})
</script>

<style lang="scss" module>
.wrapper {
}

.header {
	margin: 0;
	height: min-content;
	line-height: 1;
	height: v-bind(collapsedHeight);
}
.content {
}
</style>
