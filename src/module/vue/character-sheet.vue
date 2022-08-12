<template>
  <SheetLayoutSidebars class="classic-character-sheet">
    <template #header>
      <DocumentImg :document="actor" />
      <DocumentName :document="actor" />
      <XpTrackerClassic />
    </template>
    <template #default>
      <Tabs>
        <Tab :title="$t('IRONSWORN.Character')">
          <IronswornMain />
        </Tab>
        <Tab :title="$t('IRONSWORN.Notes')">
          <IronswornNotes />
        </Tab>
      </Tabs>
    </template>
    <template #footer>
      <Conditions />
    </template>
  </SheetLayoutSidebars>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  max-height: 83px;
}
</style>

<script setup lang="ts">
import SheetLayoutSidebars from './components/layout/SheetLayoutSidebars.vue'
import { $ActorKey } from './provisions'
import { IronswornActor } from '../actor/actor'
import { provide, computed, inject } from 'vue'
import Conditions from './components/conditions/conditions.vue'
import Tabs from './components/tabs/tabs.vue'
import Tab from './components/tabs/tab.vue'
import IronswornMain from './components/character-sheet-tabs/ironsworn-main.vue'
import IronswornNotes from './components/character-sheet-tabs/ironsworn-notes.vue'
import DocumentImg from './components/document-img.vue'
import DocumentName from './components/document-name.vue'
import XpTrackerClassic from './components/xp-tracker-classic.vue'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()

provide(
  'actor',
  computed(() => props.actor)
)

const $actor = inject($ActorKey)
</script>
