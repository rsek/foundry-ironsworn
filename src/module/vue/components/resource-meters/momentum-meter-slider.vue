<template>
  <article
    class="momentum-meter-slider"
    :aria-labelledby="`momentum-label-${actor._id}`"
  >
    <!-- <label for="momentum-slider" class="vertical-v2">
      {{ $t('IRONSWORN.Momentum') }}
    </label>
    <BtnMomentumBurn class="block" /> -->
    <BtnMomentumBurn
      tabindex="0"
      :id="`momentum-label-${actor._id}`"
      class="text nogrow vertical-v2"
      :tooltip="$t('IRONSWORN.Burn')"
    >
      {{ $t('IRONSWORN.Momentum') }}</BtnMomentumBurn
    >
    <section class="momentum-status flexcol">
      <span>
        {{ $t('IRONSWORN.Reset') }}: {{ actor?.data.momentumReset }}
      </span>
      <span>
        {{ $t('IRONSWORN.Max') }}:
        {{ actor?.data.momentumMax }}
      </span>
    </section>
    <AttrSlider
      :id="`momentum-slider-${actor._id}`"
      attr="momentum"
      :max="10"
      :min="-6"
      :softMax="actor?.data.momentumMax"
      :orientation="orientation"
      :current="actor?.data.momentum"
    />
    <!-- <hr class="nogrow" /> -->
  </article>
</template>

<style lang="less">
.momentum-meter-slider {
  display: grid;
  grid-template-columns: max-content max-content;
  grid-template-rows: max-content max-content max-content;
  label,
  button {
    text-transform: uppercase;
    line-height: 1;
  }
  label {
    grid-column: 2;
  }
  .attr-slider {
    grid-row: 1;
  }
  .momentum-status {
    grid-row: 3;
    grid-column: 1;
  }
  button {
    grid-column: 2;
    // grid-row: 2;
    // grid-column: 1;
  }
}
</style>

<script lang="ts" setup>
import { computed, Ref } from '@vue/reactivity'
import { inject } from 'vue'
import { $ActorKey } from '../../provisions.js'
import BtnMomentumBurn from '../buttons/btn-momentum-burn.vue'
import AttrSlider from './attr-slider.vue'

const props = withDefaults(
  defineProps<{
    orientation: 'horizontal' | 'vertical'
  }>(),
  { orientation: 'vertical' }
)
const actor = inject('actor') as Ref
const $actor = inject($ActorKey)
</script>
