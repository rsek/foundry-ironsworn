<template>
	<component
		:is="el"
		:class="{ [$style.wrapper]: true, 'fa-stack': true }"
		:aria-label="label"
		:role="label ? 'img' : 'presentational'"
		:aria-hidden="label ? false : true">
		<slot>
			<FontIcon class="fa-stack-2x" v-bind="bgOptions" />
			<FontIcon class="fa-stack-1x" v-bind="fgOptions" />
		</slot>
	</component>
</template>

<script lang="ts" setup>
import type { ExtractPropTypes } from 'vue'
import FontIcon from './font-icon.vue'

interface IconStackLayerOptions
	extends Omit<ExtractPropTypes<typeof FontIcon>, 'size' | 'label'> {}

interface IconStackOptions
	extends Omit<
		ExtractPropTypes<typeof FontIcon>,
		'icon' | 'stack' | 'family' | 'style'
	> {
	bgOptions?: IconStackLayerOptions
	fgOptions?: IconStackLayerOptions
}

const props = withDefaults(defineProps<IconStackOptions>(), {})
</script>

<style lang="scss" module>
.wrapper {
	// TODO
}
</style>
