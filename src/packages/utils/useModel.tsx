/*
 * @Author: your name
 * @Date: 2021-02-14 15:39:03
 * @LastEditTime: 2021-02-17 13:13:55
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \form-visual-editor\src\packages\utils\useModel.tsx
 */
import { defineComponent, ref, watch } from "vue";

/**
 * 双向绑定传的json值
 * @param getter 获取props的值
 * @param emitter emit给父组件
 */
export function useModel<T>(getter: () => T, emitter: (val: T) => void) {
  const state = ref(getter()) as { value: T }

  console.log(getter,emitter)  
  watch(getter, val => {
    if (val !== state.value) {
      state.value = val
    }
  })

  return {
    get value() {
      return state.value
    },
    set value(val: T) {
      if (state.value !== val) {
        state.value = val
        emitter(val)
      }
    }
  }
}


export const testUseModel = defineComponent({
  props: {
    modelValue: {
      type: String
    }
  },
  emits: {
    'update:modelValue': (val?: string) => true
  },
  setup(props,ctx){
    const model = useModel(() => props.modelValue,value => ctx.emit('update:modelValue',value))
    console.log(model)
    return ()=>(
      <div>
        自定义
        <input type="text" v-model={model.value} />
      </div>
    )
  }
})