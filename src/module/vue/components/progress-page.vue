<template>
  <h1>Hi, I'm a page! Yay!</h1>
  <pre><code>{{JSON.stringify(page, null, 2)}}</code></pre>
</template>

<script setup lang="ts">
import { ProgressTrackDataSource } from '../../journal/journal-entry-page-types.js'

defineProps<{ page: ProgressTrackDataSource }>()
</script>
