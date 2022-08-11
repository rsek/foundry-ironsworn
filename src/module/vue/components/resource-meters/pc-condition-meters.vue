<template>
  <div class="pc-condition-meters flexcol">
    <ConditionMeterSlider
      v-for="resource in ['Health', 'Spirit', 'Supply']"
      orientation="vertical"
      :attr="resource.toLowerCase()"
      :max="5"
      :min="0"
      :buttonLabel="$t(`IRONSWORN.${resource}`)"
    />
  </div>
</template>

<style lang="less">
.pc-condition-meters {
  gap: 6px;
  .condition-meter-slider {
    &:not(:last-child) {
      padding-bottom: 6px;
      border-bottom: 1px solid currentColor;
    }
  }
  button {
    height: max-content;
  }
}
</style>
<script lang="ts" setup>
import ConditionMeterSlider from './condition-meter-slider.vue'
</script>
