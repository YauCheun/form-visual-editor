import { computed, defineComponent, PropType } from "vue";
import "@/assets/css/visual-editor.scss"
import { VisualEditorBlockData, VisualEditorConfig, VisualEditorModelValue } from "./visual-editor.utils";
import { useModel } from "./utils/useModel";
import { VisualEditorBlock } from '@/packages/visual-editor-block'

export const VisualEditor = defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<VisualEditorModelValue>,
      required: true
    },
    config:{
      type: Object as PropType<VisualEditorConfig>,
      required :true
    }
  },
  emits: {
    'update:modelValue': (val?: VisualEditorModelValue) => {
      console.log(val)
      return true
    }
  },
  setup(props, ctx) {
    const dataModel = useModel(() => props.modelValue, val => ctx.emit('update:modelValue', val))
    const containerStyle = computed(() => ({
      width: `${dataModel.value.container.width}px`,
      height: `${dataModel.value.container.height}px`
    }))
    return () => (
      <div class="visual-editor">
        <div class="visual-editor-menu">
          <div class="visual-editor-menu-title">
            菜单tou
          </div>
          { props.config.componentList.map(component=>
            <div class="visual-editor-menu-item">
              <span class="visual-editor-menu-item-label">{component.label}</span>
              <div class="visual-editor-menu-item-content">
                {component.preview()}
              </div>
            </div>
          )}
        </div>
        <div class="visual-editor-head">
          头部
        </div>
        <div class="visual-editor-operator">
          详情操作
          <div class="visual-editor-operator-title">
            详情操作
          </div>
        </div>
        <div class="visual-editor-body">
          <div class="visual-editor-content">
            <div class="visual-editor-container" style={containerStyle.value}>
              {!!dataModel.value.blocks && (
                dataModel.value.blocks.map((block, index) => (
                  <VisualEditorBlock block={block} key={index} />
                ))
              )}

            </div>
          </div>
        </div>
      </div>
    )
  }
})