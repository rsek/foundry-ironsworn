<!-- shell component used to build standardize buttons that perform an action roll -->

<template>
  <btn-isicon
    @click="$emit('click')"
    class="action-roll"
    icon="d10-tilt"
    aria-haspopup="dialog"
    :tooltip="tooltip"
    :disabled="disabled"
  >
    <slot></slot>
  </btn-isicon>
</template>

<script>
export default {
  props: {
    tooltip: String,
    disabled: Boolean,
  },
}
</script>
