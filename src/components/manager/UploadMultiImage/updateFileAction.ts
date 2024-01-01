import { UploadFile } from "antd"
import { StateType, Response } from "./type"

export type UpdateFileType = {
  type: "updateFile"
  payload: {
    files: UploadFile<Response[]>[]
  }
}

export default function updateFileAction(
  state: StateType,
  action: UpdateFileType,
) {
  const oldFiles = state.file.filter((file) =>
    action.payload.files.includes(file),
  )
  const newFiles = action.payload.files.filter(
    (file) => !state.file.includes(file),
  )
  const files = oldFiles.concat(newFiles)
  return {
    url: files.filter((i) => i.status == "done").map((i) => i.url),
    file: files,
  }
}
