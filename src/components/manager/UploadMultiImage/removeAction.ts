import { UploadFile } from "antd"
import { StateType } from "./type"

export type RemoveType = {
  type: "remove"
  payload: {
    file: UploadFile<Response[]>
  }
}

export function removeAction(state: StateType, action: RemoveType) {
  return {
    file: state.file.filter((i) => i.uid != action.payload.file.uid),
    url: state.url.filter((i) => action.payload.file.url != i),
  }
}
