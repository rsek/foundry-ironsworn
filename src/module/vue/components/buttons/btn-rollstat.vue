<template>
  <btn-rollaction
    @click="rollStat()"
    :tooltip="tooltip"
    class="stat-roll"
    :class="attr"
    :disabled="disabled"
  >
    <slot></slot>
  </btn-rollaction>
</template>

<script>
export default {
  props: {
    actor: { type: Object, required: true },
    item: Object, // the asset. only needed if this is an asset condition meter
    attr: { type: String, required: true },
    tooltip: String,
    disabled: Boolean,
  },
  methods: {
    rollStat() {
      // console.log(this.attr, this.item)
      CONFIG.IRONSWORN.RollDialog.show({
        actor: this.$actor,
        stat: this.attr,
        asset: this.item ? this.$item : undefined,
      })
    },
  },
}
</script>
