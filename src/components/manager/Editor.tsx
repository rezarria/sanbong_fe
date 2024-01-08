import { CKEditor } from "@ckeditor/ckeditor5-react"
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic"
import { SourceEditing } from "@ckeditor/ckeditor5-source-editing"
import { Essentials } from "@ckeditor/ckeditor5-essentials"
import { Bold, Italic, CodeEditing } from "@ckeditor/ckeditor5-basic-styles"
import { Paragraph } from "@ckeditor/ckeditor5-paragraph"
type Props = {
  value?: string
  onChange?: (data?: string) => void
}

export default function Editor(props: Readonly<Props>) {
  return (
    <CKEditor
      data={props.value}
      editor={ClassicEditor}
      config={{
        plugins: [
          Essentials,
          Bold,
          Italic,
          Paragraph,
          SourceEditing,
          CodeEditing,
        ],
        toolbar: ["Bold", "Italic", "CodeEditing", "SourceEditing"],
      }}
      onChange={(e, editor) => {
        props.onChange?.(editor.getData())
      }}
    />
  )
}
