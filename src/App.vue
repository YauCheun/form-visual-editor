
<template>
  HelloWorld
  <visual-editor v-model="jsonData" :config="visualConfig"/>
  <!-- <test-use-model v-model="val" /> -->
  <!-- <VisualEditorBlock block="block" /> -->
  val:{{ val }}
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VisualEditor } from "@/packages/visual-editor";
import { visualConfig } from './packages/visual.config'
// import {testUseModel} from '@/packages/utils/useModel'
// import {VisualEditorBlock} from '@/packages/visual-editor-block'
export default defineComponent({
  name: "App",
  components: {
    VisualEditor
    // VisualEditorBlock
    // testUseModel
  },
  data() {
    return {
      visualConfig,
      val: "1",
      block: {
        top: 152.5,
        left: 168,
      },
      jsonData: {
        container: {
          height: 500,
          width: 700,
        },
        blocks: [
          {
            top: 152.5,
            left: 168,
          },
          {
            top: 190,
            left: 272,
          },
        ],
      },
    };
  },
});
</script>

<style lang="scss" scoped>
#app {
  html,
  body {
    margin: 0;
    padding: 0;
  }
}
</style>
