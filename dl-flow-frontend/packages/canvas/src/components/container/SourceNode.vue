<template>
  <div
    :class="{
      node: true,
    }"
    ref="wrapper"
  >
    <span @contextmenu="()=>{}">{{ label }}</span>
  </div>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue';
import i18n from '../../i18n'
const locale = i18n.global.locale

/**
 * @type {()=>void}
 */
const getNode = inject('getNode');
/**
 * @type {import('@antv/x6').Node}
 */
const node = getNode();

const label = ref(node.getData().label[locale.value])
/**
 * @type {HTMLElement}
 */
const wrapper = ref(null)

node.on('change:data', ({ current }) => {
  // TODO: diff, and append/del ports
})
onMounted(() => {
  node.resize(wrapper.value.clientWidth, wrapper.value.clientHeight, { absolute: true })
})
</script>