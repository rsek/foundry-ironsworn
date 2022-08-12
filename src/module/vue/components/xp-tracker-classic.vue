<template>
  <article class="flexrow xp xp-tracker-classic">
    <h4 class="nogrow">{{ $t('IRONSWORN.XP') }}</h4>
    <div class="flexrow">
      <XpBox :key="0" :current="-1" :value="0" @click="setXp(0)"> × </XpBox>
      <XpBox
        v-for="n in xpArray"
        :key="n"
        :value="n"
        :current="actor.data.xp"
        @click="setXp(n)"
      />
    </div>
  </article>
</template>

<style lang="less">
.xp-tracker-classic {
  gap: 5px;
  h4 {
    margin: 0;
  }
}
</style>

<script setup lang="ts">
import { reactive, Ref } from '@vue/reactivity'
import { inject } from '@vue/runtime-core'
import { range } from 'lodash'
import { $ActorKey } from '../provisions'
import XpBox from './xp-box.vue'

const actor = inject('actor') as Ref
const xpArray = range(1, 10)

const $actor = inject($ActorKey)
function setXp(n) {
  $actor?.update({ data: { xp: n } })
}
</script>
