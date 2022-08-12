<template>
  <textarea
    class="pc-bio-editor"
    rows="4"
    :value="$actor?.data.biography"
    ref="characteristics"
    :placeholder="$t('IRONSWORN.Characteristics')"
    :data-tooltip="$t('IRONSWORN.Characteristics')"
    @keyup="save"
  />
</template>

<script lang="ts" setup>
import { computed, inject, provide, ref } from 'vue'
import { IronswornActor } from '../actor/actor'
import { $ActorKey } from '../provisions.js'

const $actor = inject($ActorKey)

const characteristics = ref<HTMLInputElement | null>(null)

const save = debounce(() => {
  $actor?.update({
    data: {
      biography: characteristics.value?.value,
    },
  })
}, 500)
</script>
