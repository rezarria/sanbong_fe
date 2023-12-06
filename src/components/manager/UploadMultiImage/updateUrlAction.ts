import { UploadFile } from "antd"
import { StateType } from "./type"
import { connect } from "@/lib/Axios"

export type UpdateUrlType = {
  type: "updateUrl"
  payload: string[]
}

export function updateUrlAction(
  state: StateType,
  action: UpdateUrlType,
): StateType {
  const oldUrls = state.url.filter(action.payload.includes)
  const newUrls = action.payload.filter((i) => !oldUrls.includes(i))
  const oldFiles = state.file.filter((file) =>
    oldUrls.includes(file.response![0].url),
  )
  const newFiles = newUrls.map(
    (url) =>
      ({
        uid: url,
        url: [connect.defaults.baseURL, url].join(""),
        response: [{ url }],
      }) as UploadFile<Response[]>,
  )
  return {
    url: oldUrls.concat(newUrls),
    file: oldFiles.concat(newFiles),
  }
}
