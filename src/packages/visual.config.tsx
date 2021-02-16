import { createVisualEditorConfig } from "./visual-editor.utils";
import {ElButton,ElInput} from "element-plus"
export const visualConfig = createVisualEditorConfig()

visualConfig.registry('text',{
  label:'文本',
  preview:()=>"预览文本",
  render:()=>"渲染文本"
})
visualConfig.registry('input',{
  label:'输入框',
  preview:()=><ElInput/>,
  render:()=>"渲染输入框"
})
