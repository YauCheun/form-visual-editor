import { defineComponent, PropType, withCtx } from "vue";
import "@/packages/visual-editor.scss"
import { VisualEditorBlockData, VisualEditorModelValue } from "./visual-editor.utils";
import { useModel } from "./utils/useModel";
import { VisualEditorBlock } from "./visual-editor-block";

export const VisualEditor = defineComponent({
  props: {
    modelValue:{
      type: Object as PropType<VisualEditorModelValue>
    }
  },
  emits: {
    'update:modelValue': (val? : VisualEditorModelValue) => {
      console.log(val)
      return true
    }
  },
  setup(props,ctx) {
    const dataModel = useModel(()=>props.modelValue,val=>ctx.emit('update:modelValue',val))
    console.log(dataModel.value)
    return () => (
      <div class="visual-editor">
        <div class="visual-editor-menu">
          菜单
          <div class="visual-editor-menu-title">
          菜单tou
          </div>
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
            {!!dataModel.value && !!dataModel.value.blocks && (
              dataModel.value.blocks.map((block,index)=>{
                <VisualEditorBlock block={block} key={index}/>
              })
            )}
          </div>
        </div>
      </div>
    )
  }
})