import { StateType } from "./type"

export type RemoveUrlType = {
  type: "removeUrl"
  payload: string
}

export default function removeUrlAction(
  state: StateType,
  payload: RemoveUrlType,
): StateType {
  return {
    url: state.url.concat(payload.payload),
    file: state.file.filter((i) => i.url != payload.payload),
  }
}
