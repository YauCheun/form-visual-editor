import { defineComponent } from "vue";
import "@/packages/visual-editor.scss"
export const VisualEditor = defineComponent({
  props: {},
  setup(props) {
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
            页面布局
          </div>
        </div>
      </div>
    )
  }
})