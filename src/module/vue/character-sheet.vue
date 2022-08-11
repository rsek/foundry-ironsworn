<template>
  <div class="flexcol">
    <!-- Header row -->
    <CharacterHeader />

    <!-- Main body row -->
    <div class="flexrow">
      <!-- Momentum on left -->
      <div class="flexcol margin-left">
        <MomentumMeterSlider :actor="actor" orientation="vertical">
        </MomentumMeterSlider>
      </div>

      <!-- Center area -->
      <div class="flexcol">
        <!-- Attributes -->
        <div class="flexrow stats">
          <AttrBox :actor="actor" attr="edge"></AttrBox>
          <AttrBox :actor="actor" attr="heart"></AttrBox>
          <AttrBox :actor="actor" attr="iron"></AttrBox>
          <AttrBox :actor="actor" attr="shadow"></AttrBox>
          <AttrBox :actor="actor" attr="wits"></AttrBox>
        </div>

        <Tabs style="margin-top: 0.5rem">
          <Tab :title="$t('IRONSWORN.Character')"><IronswornMain /></Tab>
          <Tab :title="$t('IRONSWORN.Notes')"><IronswornNotes /></Tab>
        </Tabs>

        <!-- Conditions & Banes & Burdens -->
        <section class="sheet-area nogrow">
          <Conditions />
        </section>
      </div>

      <!-- Stats on right -->
      <div class="flexcol margin-right">
        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <BtnRollStat
            class="nogrow vertical-v2 text"
            :actor="actor"
            attr="health"
          >
            {{ $t('IRONSWORN.Health') }}
          </BtnRollStat>
          <div class="flexcol stack health">
            <ConditionMeterSlider
              :actor="actor"
              attr="health"
              :max="5"
              :min="0"
            ></ConditionMeterSlider>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <BtnRollStat
            class="nogrow vertical-v2 text"
            :actor="actor"
            attr="spirit"
          >
            {{ $t('IRONSWORN.Spirit') }}
          </BtnRollStat>
          <div class="flexcol stack spirit">
            <ConditionMeterSlider
              :actor="actor"
              attr="spirit"
              :max="5"
              :min="0"
            ></ConditionMeterSlider>
          </div>
        </div>

        <hr class="nogrow" />

        <div class="flexrow nogrow" style="flex-wrap: nowrap">
          <!-- TODO: restyle as h4-like -->
          <BtnRollStat
            class="nogrow vertical-v2 text"
            :actor="actor"
            attr="supply"
          >
            {{ $t('IRONSWORN.Supply') }}
          </BtnRollStat>
          <div class="flexcol stack supply">
            <ConditionMeterSlider
              :actor="actor"
              attr="supply"
              :max="5"
              :min="0"
            ></ConditionMeterSlider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  max-height: 83px;
}
</style>

<script setup lang="ts">
import { $ActorKey } from './provisions'
import AttrBox from './components/attr-box.vue'
import BtnRollStat from './components/buttons/btn-roll-stat.vue'
import { IronswornActor } from '../actor/actor'
import { provide, computed, inject } from 'vue'
import { RollDialog } from '../helpers/rolldialog'
import CharacterHeader from './components/character-header.vue'
import Conditions from './components/conditions/conditions.vue'
import Tabs from './components/tabs/tabs.vue'
import Tab from './components/tabs/tab.vue'
import IronswornMain from './components/character-sheet-tabs/ironsworn-main.vue'
import IronswornNotes from './components/character-sheet-tabs/ironsworn-notes.vue'
import MomentumMeterSlider from './components/resource-meters/momentum-meter-slider.vue'
import ConditionMeterSlider from './components/resource-meters/condition-meter-slider.vue'

const props = defineProps<{
  actor: ReturnType<typeof IronswornActor.prototype.toObject>
}>()

provide(
  'actor',
  computed(() => props.actor)
)

const $actor = inject($ActorKey)

function rollStat(stat) {
  RollDialog.show({ actor: $actor, stat })
}
function openCompendium(name) {
  const pack = game.packs?.get(`foundry-ironsworn.${name}`)
  pack?.render(true)
}
</script>
