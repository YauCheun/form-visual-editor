export interface VisualEditorModelValue {
  container: {
    width: number,
    height: number
  },
  blocks: VisualEditorBlockData[]
}
export interface VisualEditorBlockData {
  componentKey: string,       //映射VIsualEditorConfig 中componentMap的component对象
  left: number,               //组件的top定位
  top: number,             //组件的left定位
  adjustPosition: boolean    //是否需要调整位置
}

//控件接口
export interface VisualEditorComponent {
  key: string, //控件名
  label: string, // 控件label
  preview: () => JSX.Element, //预览的JSX
  render: () => JSX.Element //渲染的JSX
}

export function createVisualEditorConfig() {
  //左边组件列表
  const componentList: VisualEditorComponent[] = []
  //申明component可以直接通过key直接取到控件
  const componentMap: Record<string, VisualEditorComponent> = {}

  //返回一个函数，注册控件
  return {
    componentList,
    componentMap,
    registry:(key: string,component: Omit<VisualEditorComponent,'key'>)=>{
      let comp = { ...component,key}
      componentList.push(comp)
      componentMap[key] = comp
    }
  }
}

export type VisualEditorConfig = ReturnType<typeof createVisualEditorConfig>