import { CKEditor } from "@ckeditor/ckeditor5-react"
import CustomCKEditor from "../CustomCKEditor"

type Props = {
  value?: string
  onChange?: (data?: string) => void
}

export default function Editor(props: Readonly<Props>) {
  return (
    <CKEditor
      data={props.value}
      editor={CustomCKEditor}
      onChange={(e, editor) => {
        props.onChange?.(editor.getData())
      }}
    />
  )
}
