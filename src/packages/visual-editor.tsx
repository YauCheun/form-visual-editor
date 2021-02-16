import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import "@/assets/css/visual-editor.scss"
import { VisualEditorBlockData, VisualEditorComponent, VisualEditorConfig, VisualEditorModelValue } from "./visual-editor.utils";
import { useModel } from "./utils/useModel";
import { VisualEditorBlock } from '@/packages/visual-editor-block'

export const VisualEditor = defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<VisualEditorModelValue>,
      required: true
    },
    config: {
      type: Object as PropType<VisualEditorConfig>,
      required: true
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
    const containerRef = ref({} as HTMLDivElement)

    // 菜单组件拖拽
    const menuDragger = {
      current: {
        component: null as null | VisualEditorComponent
      },
      //开始拖元素触发
      dragstart: (e: DragEvent, component: VisualEditorComponent) => {
        containerRef.value.addEventListener('dragenter', menuDragger.dragenter)
        containerRef.value.addEventListener('dragover', menuDragger.dragover)
        containerRef.value.addEventListener('dragleave', menuDragger.dragleave)
        containerRef.value.addEventListener('drop', menuDragger.drop)
        menuDragger.current.component = component
      },

      //元素拖进contanier（绑定drop事件的元素）时触发
      dragenter: (e: DragEvent) => {
        //设置或返回拖放目标上允许发生的拖放行为
        e.dataTransfer!.dropEffect = 'move'
      },

      //当元素离开drop元素(contanier)时触发
      dragleave: (e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'none'
      },

      //当元素拖动到drop元素(contanier)上时触发
      dragover: (e: DragEvent) => {
        e.preventDefault()
      },

      //当元素放下到drop元素(contanier)触发
      drop: (e: DragEvent) => {
        console.log(menuDragger.current.component)
        const blocks = dataModel.value.blocks || []
        blocks.push({
          top:e.offsetY,
          left:e.offsetX
        })
        dataModel.value={
          ...dataModel.value,
          blocks
        }
      },

      //放开拖动元素时触发
      dragend: () => {
        containerRef.value.removeEventListener('dragenter', menuDragger.dragenter)
        containerRef.value.removeEventListener('dragover', menuDragger.dragover)
        containerRef.value.removeEventListener('dragleave', menuDragger.dragleave)
        containerRef.value.removeEventListener('drop', menuDragger.drop)
        menuDragger.current.component = null
      }
    }
    return () => (
      <div class="visual-editor">
        <div class="visual-editor-menu">
          <div class="visual-editor-menu-title">
            菜单tou
          </div>
          {props.config.componentList.map(component =>
            <div class="visual-editor-menu-item"
              draggable
              onDragend={menuDragger.dragend}
              onDragstart={(e) => menuDragger.dragstart(e, component)}
            >
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
            <div class="visual-editor-container" style={containerStyle.value} ref={containerRef}>
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