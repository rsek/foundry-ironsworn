<template>
  <section class="vue-dialog-content">
    <slot></slot>
  </section>
  <section class="vue-dialog-buttons">
    <slot name="buttons">
      <BtnFaicon icon="ok" @onclick="$emit('dialogOk')">OK</BtnFaicon>
      <BtnFaicon icon="cancel" @onclick="$emit('dialogCancel')"
        >Cancel</BtnFaicon
      >
    </slot>
  </section>
</template>

<script setup lang="ts">
import BtnFaicon from './buttons/btn-faicon.vue.js'
</script>
