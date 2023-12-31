import { StateType } from "./type"
import updateFileAction, { UpdateFileType } from "./updateFileAction"
import { UpdateType, updateReducer } from "./updateAction"
import { UpdateUrlType, updateUrlAction } from "./updateUrlAction"
import addUrlAction, { AddUrlType } from "./addUrlAction"
import removeUrlAction, { RemoveUrlType } from "./removeUrlAction"
import { RemoveType, removeAction } from "./removeAction"

export type ActionType = {
  type?: "update"
  payload: StateType
}

export type Actions =
  | UpdateType
  | UpdateFileType
  | UpdateUrlType
  | AddUrlType
  | RemoveUrlType
  | RemoveType

export function uploadMultiImageReducer(
  state: StateType,
  action: Actions,
): StateType {
  switch (action.type) {
    case "update":
      return updateReducer(state, action)
    case "updateFile":
      return updateFileAction(state, action)
    case "updateUrl":
      return updateUrlAction(state, action)
    case "removeUrl":
      return removeUrlAction(state, action)
    case "addUrl":
      return addUrlAction(state, action)
    case "remove":
      return removeAction(state, action)
    default:
      return state
  }
}
