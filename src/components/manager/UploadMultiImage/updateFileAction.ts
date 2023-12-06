import { UploadFile } from "antd"
import { StateType, Response } from "./type"

export type UpdateFileType = {
  type: "updateFile"
  payload: UploadFile<Response[]>[]
}

export default function updateFileAction(
  state: StateType,
  action: UpdateFileType,
) {
  const oldFiles = state.file.filter((file) => action.payload.includes(file))
  const newFiles = action.payload.filter((file) => !state.file.includes(file))
  return {
    url: oldFiles
      .concat(newFiles)
      .filter((i) => i.status == "done")
      .map((i) => i.response![0].url),
    file: oldFiles.concat(newFiles),
  }
}
