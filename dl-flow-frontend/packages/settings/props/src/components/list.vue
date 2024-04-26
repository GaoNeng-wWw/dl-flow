<template>
    <t-form label-position="left" ref="form">
        <t-form-item v-for="(item,idx) of data" :label="`元素-${idx}`" :key="idx">
            <div class="widget">
                <component :is="record[props.property.items]" v-model="data[idx]" :prop="idx" />
                <popover title="确定要删除吗" trigger="manual" :modelValue="triggerVisible === idx">
                    <template #reference>
                        <plus class="widget__plus" @click="triggerVisible = triggerVisible === idx ? -1 : idx" />
                    </template>
                    <div>
                        <t-button type="danger" @click="()=>deleteItem(idx)">
                            确认
                        </t-button>
                        <t-button @click="triggerVisible=false">
                            取消
                        </t-button>
                    </div>
                </popover>
            </div>
        </t-form-item>
        <t-button @click="appendEmptyDataItem" style="margin-top: 16px;">
            添加元素
        </t-button>
    </t-form>
</template>
  
<script setup>
import { defineEmits, defineProps, ref,watch } from 'vue'
import { Form as TForm, FormItem as TFormItem, Input as TInput, Button as TButton, Checkbox, Numeric, Popover} from '@opentiny/vue'
import { IconPlus } from '@opentiny/vue-icon';
import { useNotify, useX6 } from '@opentiny/tiny-engine-controller';
import {v4 as uuidV4} from 'uuid';
const props = defineProps({
  modelValue: Array,
  defaultValue: Array,
  property: Object,
  cellId: String
})
const record = {
    'boolean': Checkbox,
    'number': Numeric,
    'string': TInput
}
const plus = IconPlus();
const emits = defineEmits(['update:modelValue'])
const data = ref([...props.modelValue]);
const form = ref();
if (!data.value.length){
    data.value = [...props.defaultValue];
}
const triggerVisible = ref(-1);
const {g} = useX6()
/**
 * @param {number} idx
 */
const deleteItem = (idx)=>{
    const _data = [...data.value];
    data.value = data.value.filter((val,i) => i !== idx);
    triggerVisible.value = -1;
    g.getCellById(props.cellId).trigger('change:data', {current: data.value,previous: _data});
}
const appendEmptyDataItem = ()=>{
    data.value.push('');
}
watch(data, () => {
    for (let i=0;i<data.value.length;i++){
        const dupId = data.value.indexOf(data.value[i],i+1);
        if (dupId > -1){
            const uuid = uuidV4().replace(/\-/,'');
            useNotify({
                type: 'error',
                message: `存在冲突值, 以设置${data.value}为${uuid}`
            })
            data.value.splice(dupId,1,uuid)
        }
    }
    emits('update:modelValue', data.value)
}, {deep: true})
</script>

<style scoped lang="less">
.widget {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
    &__plus {
        font-size: 24px;
        rotate: 45deg;
        color: rgb(255, 38, 38);
        cursor: pointer;
    }
}
</style>