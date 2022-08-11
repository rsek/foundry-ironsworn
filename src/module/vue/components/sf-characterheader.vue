<template>
  <textarea
    rows="4"
    :value="actor.data.biography"
    ref="characteristics"
    style="flex-basis: 300px; margin-left: 6px"
    :placeholder="$t('IRONSWORN.Characteristics')"
    :data-tooltip="$t('IRONSWORN.Characteristics')"
    @keyup="save"
  />
</template>

<style lang="less" scoped>
input,
textarea {
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  resize: none;
}
</style>

<script lang="ts" setup>
import { debounce } from 'lodash'
import { inject, ref, Ref } from 'vue'
import { $ActorKey } from '../provisions'

const actor = inject('actor') as Ref
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
