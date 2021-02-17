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
    const menuDragger = (() => {
      /**
       * 当前拖拽的数据
       */
      let component = null as null | VisualEditorComponent
      //开始拖元素触发
      const blockHandler = {
        dragstart: (e: DragEvent, current: VisualEditorComponent) => {
          containerRef.value.addEventListener('dragenter', containerHandler.dragenter)
          containerRef.value.addEventListener('dragover', containerHandler.dragover)
          containerRef.value.addEventListener('dragleave', containerHandler.dragleave)
          containerRef.value.addEventListener('drop', containerHandler.drop)
          component = current
        },
        //放开拖动元素时触发
        dragend: () => {
          containerRef.value.removeEventListener('dragenter', containerHandler.dragenter)
          containerRef.value.removeEventListener('dragover', containerHandler.dragover)
          containerRef.value.removeEventListener('dragleave', containerHandler.dragleave)
          containerRef.value.removeEventListener('drop', containerHandler.drop)
          component = null
        }
      }

      const containerHandler = {
        //元素拖进contanier（绑定drop事件的元素）时触发,设置鼠标为可放置状态
        dragenter: (e: DragEvent) =>e.dataTransfer!.dropEffect = 'move',

        //当元素离开容器时触发，鼠标离开容器设置鼠标为不可放置的状态
        dragleave: (e: DragEvent) => e.dataTransfer!.dropEffect = 'none',
        //当元素在容器中移动时触发，禁用默认事件
        dragover: (e: DragEvent) =>e.preventDefault(),

        //当元素放下到drop元素(contanier)触发，获取事件对象的offsetX|Y,添加组件数据
        drop: (e: DragEvent) => {
          const blocks = dataModel.value.blocks || []
          blocks.push({
            componentKey: component!.key,
            top: e.offsetY,
            left: e.offsetX,
            adjustPosition:true
          })
          dataModel.value = {
            ...dataModel.value,
            blocks
          }
        }
      }
      return blockHandler
    })()
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
                  <VisualEditorBlock config={props.config} block={block} key={index} />
                ))
              )}

            </div>
          </div>
        </div>
      </div>
    )
  }
})