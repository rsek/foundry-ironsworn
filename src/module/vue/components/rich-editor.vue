<template>
	<div v-if="data.editing" class="editor prosemirror flexcol" v-bind="$attrs" @focusout="onFocusOut">
		<div ref="editorTarget" class="editor-content" />
	</div>
	<Suspense v-else>
		<rich-editor-rendered-content
			v-bind="$attrs"
			:text="modelValue"
			@editclick="data.editing = true"
		/>
	</Suspense>
</template>

<script setup lang="ts">
import { onUnmounted, reactive, ref, watch, nextTick } from 'vue'
import RichEditorRenderedContent from './rich-editor-rendered-content.vue'

const props = defineProps<{
	modelValue: string
	editing?: boolean
}>()

const data = reactive({ editing: props.editing ?? false })

const $emit = defineEmits<{
	'update:modelValue': [string]
	save: []
}>()

const editorTarget = ref<HTMLElement | null>(null)
let editorInstance: { view: { state: { doc: { content: unknown } } }, destroy: () => void } | null = null

function getContent(): string {
	if (!editorInstance) return props.modelValue
	const pm = (foundry as any).prosemirror
	if (!pm?.dom?.serializeString) return props.modelValue
	return pm.dom.serializeString(editorInstance.view.state.doc.content)
}

function saveAndClose() {
	const html = getContent()
	$emit('update:modelValue', html)
	$emit('save')
	data.editing = false
}

function saveOnly() {
	const html = getContent()
	$emit('update:modelValue', html)
	$emit('save')
}

function destroyEditor() {
	if (editorInstance) {
		editorInstance.destroy()
		editorInstance = null
	}
}

/** Called when focus leaves the editor container. Defers to check whether
 *  focus moved to a child (e.g. toolbar button) before saving. */
function onFocusOut(event: FocusEvent) {
	const container = event.currentTarget as HTMLElement
	// If focus moved to somewhere still inside this container (e.g. toolbar), ignore
	if (
		event.relatedTarget instanceof Node &&
		container.contains(event.relatedTarget)
	) {
		return
	}
	saveOnly()
}

watch(
	() => data.editing,
	async (editing) => {
		if (!editing) {
			destroyEditor()
			return
		}
		await nextTick()
		if (!editorTarget.value) return

		const ProseMirrorEditor = (foundry as any).applications?.ux?.ProseMirrorEditor
		if (!ProseMirrorEditor) return

		// Build a custom keymap plugin so Ctrl/Cmd+S saves and closes the editor.
		// foundry.prosemirror.plugins.keymap is v14+; guard for v13 compatibility.
		const keymapFn = (foundry as any).prosemirror?.plugins?.keymap
		const extraPlugins: Record<string, unknown> = {}
		if (keymapFn) {
			extraPlugins.saveKeymap = keymapFn({
				'Mod-s': () => {
					saveAndClose()
					return true
				},
			})
		}

		editorInstance = await ProseMirrorEditor.create(
			editorTarget.value,
			props.modelValue,
			{ plugins: extraPlugins }
		)

		// Prevent Ctrl+Wheel zoom inside the editor iframe/content area
		editorTarget.value.addEventListener(
			'wheel',
			(event: WheelEvent) => {
				if (event.ctrlKey) event.preventDefault()
			},
			{ passive: false }
		)
	},
	{ immediate: false }
)

onUnmounted(() => {
	if (editorInstance) {
		saveOnly()
		destroyEditor()
	}
})

function enableEditor() {
	data.editing = true
}
defineExpose({ enableEditor })
</script>
