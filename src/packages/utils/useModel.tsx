import { defineComponent, ref, watch } from "vue";

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