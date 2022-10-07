<template>
  <!-- <article class="attr-box stat" :id="id()">
    <label :id="id('title')" :for="id('spinner_input')" class="stat-title">{{
      $t(i18nKey)
    }}</label>
    <btn-rollstat
    :actor="actor"
    :attr="attr"
    :tooltip=""
    >

    </btn-rollstat>
    <number-spinner
      :aria-labelledby="id('title')"
      :value="parseInt(actor.data[attr])"
      :min="0"
      :max="4"
      :step="1"
      :readonly="!editMode"
      :id="id('spinner')"
      inputClass="stat-value"
      @input="updateValue"
    />
  </article> -->

  <!--
  <div :class="classes" @click="click">
    <h4>{{ $t(i18nKey) }}</h4>
    <div class="flexrow" style="position: relative">
      <div v-if="!editMode" class="bg-die">
        <i class="isicon-d10-tilt"></i>
      </div> -->
  <div
    :class="classes"
    @click="click"
    :data-tooltip="$t('IRONSWORN.Roll +x', { stat: $t(i18nKey) })"
  >
    <h4>{{ $t(i18nKey) }}</h4>
    <div class="flexrow">
      <div class="clickable text" v-if="editMode" @click="decrement">
        &minus;
      </div>
      <h4>{{ actor.data[attr] }}</h4>
      <div class="clickable text" v-if="editMode" @click="increment">
        &plus;
      </div>
    </div>
  </div>
  -->
</template>

<!-- <style lang="less">
.attr-box {
  display: flex;
  flex-flow: column nowrap;
  text-align: center;
  .stat-title,
  .stat-value {
    text-transform: uppercase;
    font-weight: bold;
    padding: 0;
  }
  .stat-value {
    max-width: 3ch;
    line-height: 1;
  }
  .number-spinner {
    .spin-button {
    }
  }
}
.bg-die {
  position: absolute;
  left: 19px;
  top: -17px;
  opacity: 0;
  font-size: 35px;
}

.stat:hover .bg-die {
  transition: opacity 0.4s ease;
  opacity: 0.2;
}
</style> -->
<!--
<script>
export default {
  props: {
    actor: { type: Object, required: true },
    attr: { type: String, required: true },
  },
  computed: {
    classes() {
      return {
        stat: true,
        block: true,
        clickable: this.clickable,
      }
    },
    i18nKey() {
      return `IRONSWORN.${this.$capitalize(this.attr)}`
    },
    editMode() {
      return this.actor.flags['foundry-ironsworn']?.['edit-mode']
    },
    clickable() {
      return this.editMode ? '' : ' clickable '
    },
  },
  methods: {
    /**
     * Generates an ID with an optional affix.
     * @param {string?} affix
     */
    id(affix) {
      let newId = `${this.actor._id}_attr-box-${this.attr}`
      if (affix) {
        newId += `_${affix}`
      }
      return newId
    },
    click() {
      if (this.editMode) return
      const actor = game.actors?.get(this.actor._id)
      CONFIG.IRONSWORN.RollDialog.show({ actor, stat: this.attr })
    },
    updateValue(event) {
      console.log('attr-box updateValue', event)
      this.$actor.update({ data: { [this.attr]: event } })
    },
  },
<style lang="less" scoped>
.stat {
  & > * {
    position: relative; // must be set to manipulate z-index
    z-index: 1;
  }
  &:before {
    // styles dice background on hover
    color: currentColor;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
    padding: 0.25em;
  }
  &:hover {
    &:before {
      opacity: 0.2;
    }
  }
}
</style> -->

<script lang="ts" setup>
import { inject, computed, capitalize, Ref } from 'vue'
import { IronswornActor } from '../../actor/actor'
import { IronswornPrerollDialog } from '../../rolls'
import { $ActorKey, ActorKey } from '../provisions'

const props = defineProps<{ attr: string }>()
const $actor = inject($ActorKey)
const actor = inject(ActorKey) as Ref<
  ReturnType<typeof IronswornActor.prototype.toObject>
>

const classes = computed(() => ({
  stat: true,
  block: true,
  clickable: !editMode.value,
  'isiconbg-d10-tilt': !editMode.value,
}))
const i18nKey = computed(() => `IRONSWORN.${capitalize(props.attr)}`)
const editMode = computed(
  () => !!(actor.value.flags as any)['foundry-ironsworn']?.['edit-mode']
)

function click() {
  if (editMode.value) return

  let attrName = game.i18n.localize('IRONSWORN.' + capitalize(props.attr))
  if (attrName.startsWith('IRONSWORN.')) attrName = props.attr
  const name = `${attrName} (${$actor?.name})`
  IronswornPrerollDialog.showForStat(
    name,
    $actor?.data.data[props.attr],
    $actor
  )
}

function increment() {
  const value = parseInt(actor.value.data[props.attr]) + 1
  $actor?.update({ data: { [props.attr]: value } })
}
function decrement() {
  const value = parseInt(actor.value.data[props.attr]) - 1
  $actor?.update({ data: { [props.attr]: value } })
}
</script>
