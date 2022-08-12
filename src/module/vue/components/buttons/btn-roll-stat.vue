<template>
  <btn-isicon
    @click="rollStat"
    :tooltip="tooltip"
    class="action-roll stat-roll"
    :class="attr"
    icon="d10-tilt"
    aria-haspopup="dialog"
    :disabled="disabled"
  >
    <slot name="default"></slot>
  </btn-isicon>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { RollDialog } from '../../../helpers/rolldialog'
import { AssetItem } from '../../../item/asset/assetitem.js'
import { $ActorKey } from '../../provisions'
import btnIsicon from './btn-isicon.vue'

const props = defineProps<{
  assetItem?: AssetItem // the asset. only needed if this is an asset condition meter
  attr: string
  tooltip?: string
  disabled?: boolean
}>()

const $actor = inject($ActorKey)
const $item = computed(() => {
  return (
    $actor?.items.find((x) => x.id === props.assetItem?._id) ??
    game.items?.get(props.assetItem?._id)
  )
})

function rollStat() {
  RollDialog.show({
    actor: $actor,
    stat: props.attr,
    asset: props.assetItem ? $item.value : undefined,
  })
}
</script>
