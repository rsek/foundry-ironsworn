<template>
  <Tabs ref="tabs">
    <Tab icon="isicon-d10-tilt" :title="$t('IRONSWORN.Moves')">
      <Suspense>
        <MoveBrowser ref="movesTab" :toolset="toolset" />
      </Suspense>
    </Tab>
    <Tab icon="isicon-oracle" :title="$t('IRONSWORN.Oracles')">
      <Suspense>
        <OracleBrowser ref="oraclesTab" :toolset="toolset" />
      </Suspense>
    </Tab>
  </Tabs>
</template>

<script lang="ts" setup>
import Tab from './components/tabs/tab.vue'
import Tabs from './components/tabs/tabs.vue'
import MoveBrowser from './components/move-browser.vue'
import OracleBrowser from './components/oracle-browser.vue'
import { computed, provide, ref } from 'vue'
import { CharacterDataProperties } from '../actor/actortypes'
import { ActorKey } from './provisions.js'

const props = defineProps<{
  actor: CharacterDataProperties
  toolset: 'ironsworn' | 'starforged'
}>()

provide(ActorKey, computed(() => props.actor) as any)

const tabs = ref<InstanceType<typeof Tabs>>()
const movesTab = ref<InstanceType<typeof MoveBrowser>>()
CONFIG.IRONSWORN.emitter.on('highlightMove', () => tabs.value?.selectIndex(0))

const oraclesTab = ref<InstanceType<typeof OracleBrowser>>()
CONFIG.IRONSWORN.emitter.on('highlightOracle', () => tabs.value?.selectIndex(1))
</script>
