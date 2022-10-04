<template>
  <div>
    <legacy-track propKey="quests" :title="$t('IRONSWORN.Quests')" />
    <legacy-track propKey="bonds" :title="$t('IRONSWORN.Bonds')" />
    <legacy-track propKey="discoveries" :title="$t('IRONSWORN.Discoveries')" />

    <hr class="nogrow" v-if="starredProgresses.length > 0" />
    <progress-box
      v-for="(progressTrack, i) in starredProgresses"
      :key="progressTrack._id ?? i"
      :item="progressTrack"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, Ref } from 'vue'
import { CharacterKey } from '../../provisions.js'
import legacyTrack from '../legacy-track.vue'
import progressBox from '../progress/progress-box.vue'

const character = inject(CharacterKey)

const starredProgresses = computed(() => {
  return character?.value.items
    .filter((x) => x.type === 'progress')
    .filter((x) => x.data.starred)
})
</script>
