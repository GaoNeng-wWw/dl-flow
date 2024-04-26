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
import {useX6} from '@opentiny/tiny-engine-controller';
const locale = i18n.global.locale

/**
 * @type {()=>void}
 */
const getNode = inject('getNode');
/**
 * @type {import('@antv/x6').Node}
 */
const node = getNode();
const {g} = useX6();
const label = ref(node.getData().label[locale.value])
/**
 * @type {HTMLElement}
 */
const wrapper = ref(null)
onMounted(()=>{
  /**
   * @type {import('@opentiny/tiny-engine-controller/useX6').MaterialInfo}
   */
  const data = node.getData();
  const {onlyIn, onlyOut} = data;
  const [property] = data.properties;
  const args = property.data;
  if (onlyIn){
    for (const arg of args){
      node.addPort({
        id: `${arg}-in`,
        group: 'top'
      })
    }
    return;
  }
  if (onlyOut){
    for (const arg of args){
      node.addPort({
        id: `${arg}-out`,
        group: 'bottom'
      })
    }
  }
})
node.on('change:data', ({ current }) => {
  // TODO: diff, and append/del ports
  const data = node.getData();
  const currentArgs = Array.from(new Set(Array.isArray(current) ? current : current.properties[0].data));
  if (currentArgs.length === 0){
    node.removePorts({group: 'bottom'})
    node.removePorts({group: 'top'})
  }
  g.batchUpdate(()=>{
    for (const arg of currentArgs){
      if (currentArgs.length >= node.getPorts().length){
        if (node.hasPort(data.id === 'start' ? `${arg}-out` : `${arg}-in`)){
          continue;
        }
        node.addPort({
          id: data.id === 'start' ? `${arg}-out` : `${arg}-in`,
          group: data.id === 'start' ? 'bottom' : 'top'
        })
      } else {
        if (!node.hasPort(data.id === 'start' ? `${arg}-out` : `${arg}-in`)){
          continue;
        }
        node.removePort({
          id: data.id === 'start' ? `${arg}-out` : `${arg}-in`,
        });
      }
    }
  })
  // console.log(utils.diff(dataB, dataA));
})
onMounted(() => {
  node.resize(wrapper.value.clientWidth, wrapper.value.clientHeight, { absolute: true })
})
</script>

<style scoped>
.node {
  width: fit-content;
  min-width: 114px;
  max-width: 120px;
  display: flex;
  padding: 8px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
  justify-content: center;
  align-items: center;
  background: #fff;
  border-left: 4px solid #5f95ff;
}
.node > span {
  /* white-space: nowrap; */
  color: #666;
  font-size: 12px;
}
.node.fail {
  border-left: 4px solid #ff4d4f;
}
</style>