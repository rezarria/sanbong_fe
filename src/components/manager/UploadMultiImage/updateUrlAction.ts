import { UploadFile } from "antd"
import { StateType } from "./type"
import config from "@/config/Config"

export type UpdateUrlType = {
  type: "updateUrl"
  payload: string[]
}

function areArraysEqual<T>(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }
  return arr1.every((element, index) => element === arr2[index])
}

export function updateUrlAction(
  state: StateType,
  action: UpdateUrlType,
): StateType {
  console.log("updateUrl")
  if (areArraysEqual(state.url, action.payload)) return state

  const oldUrls = state.url.filter(action.payload.includes)
  const newUrls = action.payload.filter((i) => !oldUrls.includes(i))
  const newFile = newUrls.map(
    (url) =>
      ({
        uid: url,
        url: [config.baseUrl, url].join(""),
        response: [{ url }],
        status: "done",
      }) as UploadFile<Response[]>,
  )
  return {
    url: oldUrls.concat(newUrls),
    file: state.file.concat(newFile),
  }
}
