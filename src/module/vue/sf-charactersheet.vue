<template>
  <SheetLayoutSidebars class="flexcol sf-character-sheet">
    <template #header>
      <DocumentImg :document="actor" size="75px" />
      <PcVitals />
      <textarea
        class="pc-bio"
        rows="4"
        :value="actor.data.biography"
        ref="characteristics"
        :placeholder="$t('IRONSWORN.Characteristics')"
        :data-tooltip="$t('IRONSWORN.Characteristics')"
        @keyup="save"
      />
    </template>
    <template #default>
      <Tabs class="character-sheet-tabs" name="character-sheet-tabs">
        <Tab :title="$t('IRONSWORN.Legacies')"> <SfLegacies /> </Tab>
        <Tab :title="$t('IRONSWORN.Assets')"> <SfAssets /> </Tab>
        <Tab :title="$t('IRONSWORN.Progress')"> <SfProgresses /> </Tab>
        <Tab :title="$t('IRONSWORN.Connections')"> <SfConnections /> </Tab>
        <Tab :title="$t('IRONSWORN.Notes')"> <SfNotes /> </Tab>
      </Tabs>
    </template>
    <template #footer>
      <SfImpacts :actor="actor" class="nogrow" />
    </template>
  </SheetLayoutSidebars>
</template>

<style lang="less">
.sf-character-sheet {
  header {
    input,
    textarea {
      border-color: rgba(0, 0, 0, 0.1);
      border-radius: 1px;
      resize: none;
    }
    textarea {
      flex-basis: 300px;
    }
  }
  .condition-meters {
    .icon-button {
      flex-direction: column;
      width: 18px;
      .button-text {
        writing-mode: vertical-lr;
      }
    }
  }
  .tabbed-panels.character-sheet-tabs {
    [role^='tablist'],
    [role*=' tablist'] {
      &[aria-orientation='horizontal'] {
        border-block-start: 0;
      }
    }
  }
}
</style>

<script lang="ts" setup>
import { computed, inject, provide, ref } from 'vue'
import SfLegacies from './components/character-sheet-tabs/sf-legacies.vue'
import SfConnections from './components/character-sheet-tabs/sf-connections.vue'
import Tabs from './components/tabs/tabs.vue'
import Tab from './components/tabs/tab.vue'
import SfImpacts from './components/sf-impacts.vue'
import { IronswornActor } from '../actor/actor'
import SfAssets from './components/character-sheet-tabs/sf-assets.vue'
import SfProgresses from './components/character-sheet-tabs/sf-progresses.vue'
import SfNotes from './components/character-sheet-tabs/sf-notes.vue'
import SheetLayoutSidebars from './components/layout/SheetLayoutSidebars.vue'
import DocumentImg from './components/document-img.vue'
import PcVitals from './components/pc-vitals.vue'
import { $ActorKey } from './provisions.js'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()

provide(
  'actor',
  computed(() => props.actor)
)

const $actor = inject($ActorKey)

const characteristics = ref<HTMLInputElement | null>(null)

const save = debounce(() => {
  $actor?.update({
    data: {
      biography: characteristics.value?.value,
    },
  })
}, 500)

function openCompendium(name) {
  const pack = game.packs?.get(`foundry-ironsworn.${name}`)
  pack?.render(true)
}
</script>
