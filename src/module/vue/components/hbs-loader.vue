<template>
  <component
    :is="is"
    class="hbs-loader"
    :class="$style.hbsLoader"
    v-html="html"
  />
</template>

<style lang="less" module>
.hbsLoader {
}
</style>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    is?: any
    path: string
    data: object
  }>(),
  { is: 'div' }
)

const html = computed(() => renderTemplate(props.path, props.data))
</script>
