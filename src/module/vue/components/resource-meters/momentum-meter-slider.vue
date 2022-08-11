<template>
  <article class="nogrow momentum-meter-slider">
    <!-- <label for="pc-momentum-slider" class="vertical-v2">
      {{ $t('IRONSWORN.Momentum') }}
    </label>
    <BtnMomentumBurn class="block" /> -->
    <BtnMomentumBurn
      class="text nogrow vertical-v2"
      :tooltip="$t('IRONSWORN.Burn')"
    >
      {{ $t('IRONSWORN.Momentum') }}</BtnMomentumBurn
    >
    <section class="pc-momentum-status flexcol">
      <span>
        {{ $t('IRONSWORN.Reset') }}: {{ $actor?.data.momentumReset }}
      </span>
      <span>
        {{ $t('IRONSWORN.Max') }}:
        {{ $actor?.data.momentumMax }}
      </span>
    </section>
    <Slider
      id="pc-momentum-slider"
      attr="momentum"
      :max="10"
      :min="-6"
      :softMax="$actor?.data.momentumMax"
      :orientation="orientation"
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
  .slider {
    grid-row: 1;
  }
  .pc-momentum-status {
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
import { computed } from '@vue/reactivity'
import { inject } from 'vue'
import { $ActorKey } from '../../provisions.js'
import BtnMomentumBurn from '../buttons/btn-momentum-burn.vue'
import Slider from './slider.vue'

const props = withDefaults(
  defineProps<{
    orientation: 'horizontal' | 'vertical'
  }>(),
  { orientation: 'vertical' }
)

const $actor = inject($ActorKey)
</script>
