import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import "@/assets/css/visual-editor.scss"
import { createNewBlock, VisualEditorBlockData, VisualEditorComponent, VisualEditorConfig, VisualEditorModelValue } from "./visual-editor.utils";
import { useModel } from "./utils/useModel";
import { VisualEditorBlock } from '@/packages/visual-editor-block'
import { useVisualCommand } from "./utils/visual.command";

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
    //方法一,双向绑定值
    const dataModel = useModel(() => props.modelValue, val => ctx.emit('update:modelValue', val))
    //方法二
    // const dataModel = computed(()=>{
    //   return props.modelValue
    // })

    //container节点的style样式
    const containerStyle = computed(() => ({
      width: `${dataModel.value.container.width}px`,
      height: `${dataModel.value.container.height}px`
    }))
    //container节点的dom对象的引用
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
        dragenter: (e: DragEvent) => e.dataTransfer!.dropEffect = 'move',

        //当元素离开容器时触发，鼠标离开容器设置鼠标为不可放置的状态
        dragleave: (e: DragEvent) => e.dataTransfer!.dropEffect = 'none',
        //当元素在容器中移动时触发，禁用默认事件
        dragover: (e: DragEvent) => e.preventDefault(),

        //当元素放下到drop元素(contanier)触发，获取事件对象的offsetX|Y,添加组件数据
        drop: (e: DragEvent) => {
          const blocks = dataModel.value.blocks || []
          blocks.push(createNewBlock({ component: component!, top: e.offsetY, left: e.offsetX }))

          //封装方法更新父组件的值,方法一
          dataModel.value = {
            ...dataModel.value,
            blocks
          }
          //方法二
          // ctx.emit("update:modelValue",{
          //     ...dataModel.value,
          //     blocks
          //   })
        }
      }
      return blockHandler
    })()
    //对外暴露的方法
    const methods = {
      clearFocus: (block?: VisualEditorBlockData) => {
        let blocks = dataModel.value.blocks || []
        if (blocks.length == 0) return
        if (block) {
          blocks = blocks.filter(item => item != block)
        }
        blocks.forEach(block => {
          block.focus = false
        })
      },
      updateBlocks: (blocks: VisualEditorBlockData[]) => {
        dataModel.value = {
          ...dataModel.value,
          blocks
        }
      }
    }
    //鼠标点击组件选中
    const focusHandler = (() => {
      return {
        container: {
          onMouseDown: (e: MouseEvent) => {
            methods.clearFocus()
            e.stopPropagation()
            e.preventDefault()
          }
        },
        block: {
          onMouseDown: (e: MouseEvent, block: VisualEditorBlockData) => {
            e.stopPropagation()
            e.preventDefault()
            if (e.shiftKey) {
              /** 如果按住了shift,如果此时没有选中的block,就选中这个block,否则取反这个block的选中状态 */
              if (focusData.value.focus.length <= 1) {
                block.focus = true
              } else {
                block.focus = !block.focus
              }
            } else {
              if (!block.focus) {
                block.focus = true
                methods.clearFocus(block)
              }
            }
            blockDraggier.mousedown(e)
          }
        }
      }
    })()

    //计算选中block和未选择block
    const focusData = computed(() => {
      let focus: VisualEditorBlockData[] = []
      let unFocus: VisualEditorBlockData[] = [];
      (dataModel.value.blocks || []).forEach((block: VisualEditorBlockData) => block.focus ? focus.push(block) : unFocus.push(block))
      return {
        focus,
        unFocus
      }
    })
    //处理block在container中拖拽移动的相关动作
    const blockDraggier = (() => {
      let dragState = {
        startX: 0,
        startY: 0,
        startPos: [] as { left: number, top: number }[]
      }
      const mousedown = (e: MouseEvent) => {
        dragState = {
          startX: e.clientX,
          startY: e.clientY,
          startPos: focusData.value.focus.map(({ top, left }) => ({ top, left }))
        }
        document.addEventListener("mousemove", mousemove)
        document.addEventListener("mouseup", mouseup)
      }
      const mousemove = (e: MouseEvent) => {
        const durX = e.clientX - dragState.startX
        const durY = e.clientY - dragState.startY
        focusData.value.focus.forEach((block, index) => {
          block.top = dragState.startPos[index].top + durY
          block.left = dragState.startPos[index].left + durX

        })
      }
      const mouseup = (e: MouseEvent) => {
        document.removeEventListener("mousemove", mousemove)
        document.removeEventListener("mouseup", mouseup)
      }

      return { mousedown }
    })()

    const commander = useVisualCommand({
      focusData,
      updateBlocks: methods.updateBlocks,
      dataModel
    })
    /* 操作栏按钮 */
    const buttons = [
      { label: '撤销', icon: 'icon-back', handler: commander.undo, tip: 'ctrl+z' },
      { label: '重做', icon: 'icon-forward', handler: commander.redo, tip: 'ctrl+y,ctrl+shift+z' },
      { label: '删除', icon: 'icon-delete', handler: ()=>commander.delete(), tip: 'ctrl+d,delete,backspace' },
    ]
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
          {buttons.map((btn,index) => 
            <div key={index} class="visual-editor-head-button" onClick={btn.handler}> 
              <i class={`iconfont ${btn.icon}`}></i>
              <span>{btn.label}</span>
            </div>
          )}
        </div>
        <div class="visual-editor-operator">
          详情操作
          <div class="visual-editor-operator-title">
            详情操作
          </div>
        </div>
        <div class="visual-editor-body">
          <div class="visual-editor-content">
            <div class="visual-editor-container"
              style={containerStyle.value}
              ref={containerRef}
              onMousedown={(e: MouseEvent) => focusHandler.container.onMouseDown(e)}
            >
              {!!dataModel.value.blocks && (
                dataModel.value.blocks.map((block, index) => (
                  <VisualEditorBlock
                    config={props.config}
                    block={block}
                    key={index}
                    {...{
                      onMouseDown: (e: MouseEvent) => focusHandler.block.onMouseDown(e, block)
                    }}
                  />
                ))
              )}

            </div>
          </div>
        </div>
      </div>
    )
  }
})