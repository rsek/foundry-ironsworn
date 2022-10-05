<template>
  <div class="flexcol">
    <div class="flexrow" style="align-items: center">
      <label class="flexrow" style="align-items: center">
        <input
          type="checkbox"
          class="nogrow"
          :checked="item.data.track.enabled"
          @change="enableClick"
        />
        <span>{{ $t('IRONSWORN.Enabled') }}</span>
      </label>

      <span style="flex-grow: 0; margin: 0 5px">{{
        $t('IRONSWORN.Name')
      }}</span>
      <input type="text" @blur="updateName" v-model="item.data.track.name" />

      <span style="flex-grow: 0; margin: 0 5px">{{ $t('IRONSWORN.Max') }}</span>
      <input
        type="number"
        @change="updateMax"
        v-model.number="item.data.track.max"
      />
    </div>

    <ConditionMeterSpinner
      class="meter-preview"
      tabindex="-1"
      style="margin-top: 5px"
      attr="track"
      :max="item.data.track.max"
      :initialValue="item.data.track.current"
      spinnerStyle="horizontal"
      labelPosition="left"
      documentType="Item"
      :buttonLabel="item.data.track.name"
    >
    </ConditionMeterSpinner>
  </div>
</template>

<style lang="less">
.meter-preview {
  pointer-events: none;
}
</style>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { $ItemKey } from '../../provisions'
import ConditionMeterSpinner from '../resource-meters/condition-meter-spinner.vue'

const item = inject(ItemKey) as Ref
const editMode = computed(() => {
  return item.value.flags['foundry-ironsworn']?.['edit-mode']
})

const $item = inject($ItemKey)
function enableClick(ev) {
  $item?.update({ 'data.track.enabled': ev.target.checked })
}

function updateName() {
  $item?.update({ 'data.track.name': item.value.data.track.name })
}

function updateMax() {
  $item?.update({ 'data.track.max': item.value.data.track.max })
}
</script>
