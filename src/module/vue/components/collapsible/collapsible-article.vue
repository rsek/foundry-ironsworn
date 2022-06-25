<template>
  <article class="collapsible">
    <header>
      <slot name="heading-before"></slot>
      <h1>
        <collapsible-toggle
          :disabled="items.length === 0"
          @click="expanded = !expanded"
        >
          <slot name="heading-content"></slot>
        </collapsible-toggle>
      </h1>
      <slot name="heading-after"></slot>
    </header>
    <transition name="slide">
      <component
        :is="contentWrapper"
        v-if="expanded"
        class="nogrow collapsible-content"
      >
        <slot name="collapsible-content"></slot>
      </component>
    </transition>
  </article>
</template>

<style lang="less">
.collapsible {
  .collapsible-toggle {
    text-transform: uppercase;
    height: inherit;
    width: inherit;
    flex-grow: 1;
  }
  h1 {
    display: flex;
  }
}
</style>

<style lang="less" scoped>
h1 {
  margin: 5px 0;
  transition: background-color 0.2s ease;
  i {
    width: 15px;
    text-align: center;
  }

  &.highlighted {
    background-color: lightyellow;
  }
}
.slide-enter-active,
.slide-leave-active {
  max-height: 106px;
  &.completed {
    max-height: 400px;
  }
}
</style>

<script>
export default {
  props: {
    actor: Object,
    contentWrapper: { type: String, default: 'section' },
  },
  data() {
    return {
      expanded: false,
    }
  },
  computed: {
    caretIcon() {
      return this.expanded ? 'caret-down' : 'caret-right'
    },
  },
}
</script>
