import { connect } from "@/lib/Axios"
import { UploadFile } from "antd"
import { StateType } from "./type"

export type UpdateType = {
  type: "update"
  payload: {
    url: string[]
    file: UploadFile<Response[]>
  }
}

export function updateReducer(state: StateType, action: UpdateType) {
  const oldUrls = state.url.filter(action.payload.url.includes)
  const newUrls = action.payload.url.filter((i) => !oldUrls.includes(i))
  const oldFiles = state.file.filter((i) =>
    oldUrls.includes(i.response![0].url),
  )
  const newFiles = newUrls.map(
    (url) =>
      ({
        url: [connect.defaults.baseURL, url].join(""),
        uid: url,
        response: [{ url }],
      }) as UploadFile<Response[]>,
  )
  return {
    file: oldFiles.concat(newFiles),
    url: oldUrls.concat(oldUrls),
  }
}
