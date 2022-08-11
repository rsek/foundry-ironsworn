<template>
  <section class="pc-vitals flexcol">
    <input
      type="text"
      :placeholder="$t('IRONSWORN.Name')"
      :data-tooltip="$t('IRONSWORN.Name')"
      v-model="actor.name"
      ref="name"
      @keyup="save"
    />
    <input
      type="text"
      :placeholder="$t('IRONSWORN.Pronouns')"
      :data-tooltip="$t('IRONSWORN.Pronouns')"
      :value="actor.data.pronouns"
      ref="pronouns"
      @keyup="save"
    />
    <input
      type="text"
      :placeholder="$t('IRONSWORN.Callsign')"
      :data-tooltip="$t('IRONSWORN.Callsign')"
      :value="actor.data.callsign"
      ref="callsign"
      @keyup="save"
    />
  </section>
</template>

<style lang="less" scoped>
input {
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  resize: none;
}

.pc-vitals {
  gap: 7px;
}
</style>

<script lang="ts" setup>
import { debounce } from 'lodash'
import { inject, ref, Ref } from 'vue'
import { $ActorKey } from '../provisions'

const actor = inject('actor') as Ref
const $actor = inject($ActorKey)

const name = ref<HTMLInputElement | null>(null)
const callsign = ref<HTMLInputElement | null>(null)
const pronouns = ref<HTMLInputElement | null>(null)

const save = debounce(() => {
  $actor?.update({
    name: name.value?.value,
    data: {
      callsign: callsign.value?.value,
      pronouns: pronouns.value?.value,
    },
  })
}, 500)
</script>
