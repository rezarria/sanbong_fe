import { UploadFile } from "antd"

export type Response = {
  url: string
}

export type StateType = {
  url: string[]
  file: UploadFile<Response[]>[]
}
