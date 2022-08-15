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
import { DocumentType } from '@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes.js'
import { inject } from 'vue'
import { RollDialog } from '../../../helpers/rolldialog'
import { $ActorKey } from '../../provisions'
import { pickInjectedDocument } from '../../composable/pickInjectedDocument.js'
import btnIsicon from './btn-isicon.vue'
import { IronswornItem } from '../../../item/item.js'

const props = defineProps<{
  documentType: DocumentType
  attr: string
  tooltip?: string
  disabled?: boolean
}>()

const { $document } = pickInjectedDocument(props.documentType)

const $actor = inject($ActorKey)

function rollStat() {
  RollDialog.show({
    actor: $actor,
    stat: props.attr,
    asset:
      props.documentType === 'Item' ? ($document as IronswornItem) : undefined,
  })
}
</script>
