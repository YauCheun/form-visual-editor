import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import { VisualEditorBlockData, VisualEditorConfig } from "./visual-editor.utils";

export const VisualEditorBlock = defineComponent({
  props: {
    block: {
      type: Object as PropType<VisualEditorBlockData>,
      required: true
    },
    config:{
      type: Object as PropType<VisualEditorConfig>,
      required: true
    }
  },
  setup(props){

    const el = ref({} as HTMLDivElement)

    const classes = computed(()=>[
      'visual-editor-block',
      {
        'visual-editor-block-focus' : props.block.focus
      }
    ])
    const blockStyle = computed(()=>({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`
    }))

    onMounted(()=>{
      /**
       * 第一次添加控件的时候，自动调整位置
       */
      const block = props.block
      if(block.adjustPosition){
        console.log( block.left)
        const {offsetWidth,offsetHeight} = el.value
        block.left = block.left - offsetWidth/2
        block.top = block.top - offsetHeight/2
        console.log( block.left)
        block.adjustPosition = false
      }
    })

    return () => {
      const component = props.config.componentMap[props.block.componentKey]
      const Render = component.render()
      return (
        <div class={classes.value} style={blockStyle.value} ref={el}>
          {Render}
        </div>
      )
    }
  }
})