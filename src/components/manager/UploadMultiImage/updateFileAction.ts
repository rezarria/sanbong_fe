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
  const urls = oldFiles.map((i) => i.url!)
  const oldUrls = state.url.filter(urls.includes)
  const newFiles = action.payload.filter((file) => !state.file.includes(file))
  const newUrls = newFiles.map((i) => i.url!)
  return {
    url: oldUrls.concat(newUrls),
    file: oldFiles.concat(newFiles),
  }
}
