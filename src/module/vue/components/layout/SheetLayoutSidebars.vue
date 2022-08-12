<template>
  <article class="layout-sidebars">
    <header class="sheet-header flexrow">
      <slot name="header"> </slot>
    </header>
    <section class="pc-sheet-sidebar-left">
      <slot name="sidebar-left">
        <MomentumMeterSlider orientation="vertical" />
      </slot>
    </section>
    <section class="pc-sheet-sidebar-right">
      <slot name="sidebar-right">
        <PcConditionMeters class="flexcol" />
      </slot>
    </section>
    <section class="pc-sheet-toolbar">
      <slot name="toolbar">
        <PcStats class="flexrow" />
      </slot>
    </section>
    <main class="pc-sheet-main">
      <slot name="default"></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </article>
</template>

<style lang="less">
.layout-sidebars {
  .stat-roll {
    text-transform: uppercase;
  }

  display: grid;
  grid-template-columns: max-content 1fr max-content;
  grid-template-rows: max-content max-content 1fr max-content;
  gap: 10px;
  header {
    grid-row: 1;
    grid-column: 1 / span 3;
    gap: 6px;
    align-items: center;
  }
  footer {
    grid-column: 1 / span 3;
    grid-row: 4;
    border-top: 1px solid currentColor;
  }
  main {
    grid-column: 2;
    grid-row: 3;
  }
  .pc-sheet-sidebar-right,
  .pc-sheet-sidebar-left {
    grid-row: 2 / span 2;
  }
  .pc-sheet-sidebar-right {
    grid-column: 3;
    border-left: 1px solid currentColor;
  }
  .pc-sheet-sidebar-left {
    grid-column: 1;
    border-right: 1px solid currentColor;
  }
  .pc-sheet-toolbar {
    grid-column: 2;
    grid-row: 2;
  }
}
</style>

<script setup lang="ts">
import MomentumMeterSlider from '../resource-meters/momentum-meter-slider.vue'
import PcStats from '../pc-stats.vue'
import PcConditionMeters from '../resource-meters/pc-condition-meters.vue'
import ConditionMeterSlider from '../resource-meters/condition-meter-slider.vue'
</script>
