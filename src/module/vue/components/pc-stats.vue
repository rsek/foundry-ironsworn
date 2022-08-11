<template>
  <article class="pc-stats">
    <!-- TODO: aria section label etc -->
    <AttrBox
      v-for="stat in ['edge', 'heart', 'iron', 'shadow', 'wits']"
      :key="stat"
      :attr="stat"
      class="stat"
      :class="{ [stat]: true }"
    />
  </article>
</template>

<style lang="less">
.pc-stats {
  justify-content: space-around;
}
</style>

<script setup lang="ts">
import AttrBox from './attr-box.vue'
</script>
