<template>
  <div ref="monacoRef"></div>
</template>

<script setup>
import { useEditor } from '@opentiny/tiny-engine-controller'
import * as monacoEditor from 'monaco-editor'
import { defineProps, defineEmits, watch, onMounted, nextTick, onBeforeUnmount, ref } from 'vue'

const emit = defineEmits(['change', 'editorWillMount', 'editorDidMount', 'update:value'])
const props = defineProps({
  original: {
    type: String
  },
  value: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    default: 'vs'
  },
  language: {
    type: String,
    default: 'python'
  },
  options: {
    type: Object
  },
  amdRequire: {
    type: Function
  },
  diffEditor: {
    type: Boolean,
    default: false
  },
  readOnly: {
    type: Boolean,
    default: false,
  }
})
const monacoRef = ref(null)
const { init: initMonaco, getModifiedEditor, getOriginalEditor, vueMonaco } = useEditor()
onMounted(() => {
  if (props.amdRequire) {
    props.amdRequire(['vs/editor/editor.main'], () => {
      vueMonaco.monaco = window.monaco
      nextTick(() => {
        initMonaco(window.monaco, emit, props, monacoRef)
      })
    })
  } else {
    vueMonaco.monaco = monacoEditor
    nextTick(() => {
      initMonaco(vueMonaco.monaco, emit, props, monacoRef)
    })
  }
})

onBeforeUnmount(() => {
  vueMonaco.editor && vueMonaco.editor.dispose()
})

watch(
  () => props.options,
  (options) => {
    if (vueMonaco.editor) {
      const editor2 = getModifiedEditor(props)
      editor2.updateOptions(options)
    }
  },
  {
    deep: true
  }
)

watch(
  () => props.value,
  (newValue) => {
    if (vueMonaco.editor) {
      const editor = getModifiedEditor(props)
      if (newValue !== editor.getValue()) {
        editor.setValue(newValue)
      }
    }
  }
)

watch(
  () => props.original,
  (newValue) => {
    if (vueMonaco.editor && props.diffEditor) {
      const editor = getOriginalEditor()
      if (newValue !== editor.getValue()) {
        editor.setValue(newValue)
      }
    }
  }
)

watch(
  () => props.language,
  (newVal) => {
    if (vueMonaco.editor) {
      const editor = getModifiedEditor()
      vueMonaco.monaco.editor.setModelLanguage(editor.getModel(), newVal)
    }
  }
)
watch(
  () => props.theme,
  (newVal) => {
    if (vueMonaco.editor) {
      vueMonaco.monaco.editor.setTheme(newVal)
    }
  }
)
</script>
