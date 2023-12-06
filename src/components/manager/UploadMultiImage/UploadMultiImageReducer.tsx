import { StateType } from "./type"
import updateFileAction, { UpdateFileType } from "./updateFileAction"
import { UpdateType, updateReducer } from "./updateAction"
import { UpdateUrlType, updateUrlAction } from "./updateUrlAction"

export type ActionType = {
  type?: "update"
  payload: StateType
}

export type Actions = UpdateType | UpdateFileType | UpdateUrlType

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
    default:
      return state
  }
}
