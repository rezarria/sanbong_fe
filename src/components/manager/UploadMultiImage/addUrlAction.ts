import { UploadFile } from "antd"
import { connect } from "../../../lib/Axios"
import { Response, StateType } from "./type"

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
      url: [connect.defaults.baseURL, payload.payload].join(""),
      response: [{ url: payload.payload }],
      status: "done",
    } as UploadFile<Response[]>),
  }
}
