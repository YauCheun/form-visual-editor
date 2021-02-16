import { computed, defineComponent, PropType } from "vue";
import { VisualEditorBlockData } from "./visual-editor.utils";

export const VisualEditorBlock = defineComponent({
  props: {
    block: {
      type: Object as PropType<VisualEditorBlockData>,
      required: true
    }
  },
  setup(props){
    const blockStyle = computed(()=>({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`
    }))

    return () => (
      <div class="visual-editor-block" style={blockStyle.value}>
        这是一个block
      </div>
    )
  }
})