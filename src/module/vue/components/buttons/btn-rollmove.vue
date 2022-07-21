<template>
  <btn-rollaction
    @click="rollMove()"
    class="move-roll"
    :tooltip="tooltip"
    :disabled="disabled"
  >
    <slot></slot>
  </btn-rollaction>
</template>

<script>
export default {
  props: {
    actor: Object,
    move: Object,
    tooltip: String,
    disabled: Boolean,
  },
  methods: {
    async rollMove() {
      CONFIG.IRONSWORN.SFRollMoveDialog.show(this.$actor, this.move.moveItem)
    },
  },
}
</script>
