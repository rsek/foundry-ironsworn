<template>
  <!-- stateless button for making consistent collapse toggles; use in composition of collapsible components -->
  <btn-faicon
    :disabled="disabled"
    class="text collapsible-toggle"
    :icon="icon"
    :aria-disabled="disabled"
    :aria-expanded="expanded"
    :aria-controls="controlsId"
    :tooltip="tooltip"
  >
    <slot></slot>
  </btn-faicon>
</template>

<script>
export default {
  props: {
    disabled: { type: Boolean, default: false },
    expanded: { type: Boolean, default: false },
    // should be the ID of a corresponding collapsible-content
    controlsId: String,
    expandedIcon: { type: String, default: 'caret-down' },
    collapsedIcon: { type: String, default: 'caret-right' },
    expandedTooltip: String,
    collapsedTooltip: String,
  },
  computed: {
    tooltip() {
      return this.isExpanded ? this.expandedTooltip : this.collapsedTooltip
    },
    icon() {
      return this.isExpanded ? this.expandedIcon : this.collapsedIcon
    },
  },
}
</script>
