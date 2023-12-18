import { UploadFile } from "antd"
import { StateType } from "./type"
import config from "@/config/Config"

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
        url: [config.baseUrl, url].join(""),
        uid: url,
        response: [{ url }],
        status: "done",
      }) as UploadFile<Response[]>,
  )
  return {
    file: oldFiles.concat(newFiles),
    url: oldUrls.concat(oldUrls),
  }
}
