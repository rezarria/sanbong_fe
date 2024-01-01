import { UploadFile } from "antd"
import { Response, StateType } from "./type"
import config from "@/config/Config"

export type AddUrlType = {
  type: "addUrl"
  payload: string
}

export default function addUrlAction(
  state: StateType,
  payload: AddUrlType,
): StateType {
  return {
    url: state.url.concat(payload.payload),
    file: state.file.concat({
      uid: payload.payload,
      url: [config.baseUrl, payload.payload].join(""),
      response: [{ url: payload.payload }],
      status: "done",
    } as UploadFile<Response[]>),
  }
}
