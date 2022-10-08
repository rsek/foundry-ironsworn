<template>
  <AttrInput
    class="momentum-meter"
    attr="momentum"
    documentType="Actor"
    :labelPosition="labelPosition"
    :value="actor?.data.momentum ?? 2"
    :min="-6"
    :max="10"
    :softMax="actor?.data.momentumMax"
    :widgetStyle="widgetStyle"
    :segmentClass="{
      [actor.data.momentumReset]: 'segment-momentum-reset',
    }"
  >
    <template #label>
      <BtnMomentumburn
        class="text"
        :class="{ vertical: sliderStyle === 'vertical' }"
        :tooltip="
          $t('IRONSWORN.BurnMomentumAndResetTo', {
            value: actor?.data.momentum,
            resetValue: actor?.data.momentumReset,
          })
        "
      >
        {{ $t('IRONSWORN.Momentum') }}
      </BtnMomentumburn>
    </template>
  </AttrInput>
</template>

<style lang="less">
.momentum-meter {
  gap: 5px 0;
  .attr-slider-label:hover ~ .slider-bar {
    .segment-momentum-reset {
      border: 1px solid var(--color-border-highlight-alt);
      border-bottom: 1px solid var(--color-border-highlight);
      box-shadow: 0 0 10px var(--color-shadow-highlight);
      z-index: 20;
    }
  }
}
</style>

<script lang="ts" setup>
import { inject, PropType, Ref } from 'vue'
import { IronswornActor } from '../../../actor/actor.js'
import { CharacterDataProperties } from '../../../actor/actortypes.js'
import { ActorKey } from '../../provisions.js'
import BtnMomentumburn from '../buttons/btn-momentumburn.vue'
import AttrInput from './attr-input.vue'

const props = defineProps<PropType<typeof AttrInput>>()

const actor = inject(ActorKey) as Ref<
  ReturnType<typeof IronswornActor.prototype.toObject> & CharacterDataProperties
>
</script>
