import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react"

type Props = {
  value?: string
  onChange?: (data?: string) => {}
}

export default function MonacoInput(props: Readonly<Props>) {
  return (
    <Editor
      height={"90vh"}
      theme="vs-dark"
      defaultLanguage="html"
      value={props.value}
      onChange={props.onChange}
    />
  )
}
