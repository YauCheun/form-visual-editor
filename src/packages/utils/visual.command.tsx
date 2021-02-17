import { useCommander } from "../plugins/command.plugin";
import { VisualEditorBlockData, VisualEditorModelValue } from "../visual-editor.utils";

export function useVisualCommand({
  dataModel,
  updateBlocks,
  focusData
}: {
  dataModel: { value: VisualEditorModelValue },
  updateBlocks: (blocks: VisualEditorBlockData[]) => void,
  focusData: { value: { focus: VisualEditorBlockData[], unFocus: VisualEditorBlockData[] } }
}) {
  const commander = useCommander()

  commander.registry({
    name: 'delete',
    keyboard: [
      'backspace',
      'delete',
      'ctrl+d'
    ],
    execute: () => {
      console.log('执行删除命令')
      let data = {
        before: [] as VisualEditorBlockData[],
        after: [] as VisualEditorBlockData[]
      }
      return {
        redo: () => {
          console.log("重做删除命令")
          data.before = dataModel.value.blocks || []
          const { unFocus } = focusData.value
          updateBlocks(unFocus)
          data.after=unFocus
          console.log( data.after)
        },
        undo: () => {
          console.log("撤回删除命令")
          updateBlocks(data.before)
        }
      }
    }
  })
  return {
    undo: () => commander.state.commands.undo(),
    redo: () => commander.state.commands.redo(),
    delete: () => commander.state.commands.delete()
  }
}