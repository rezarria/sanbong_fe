import { PlusOutlined } from "@ant-design/icons"
import { Upload, UploadFile, message } from "antd"
import { useCallback, useEffect, useReducer } from "react"
import { RcFile, UploadChangeParam, UploadProps } from "antd/es/upload"
import { uploadMultiImageReducer } from "./UploadMultiImageReducer"
import useConnect from "../../../store/useConnect"

type Props = {
  value?: string[]
  onChange?: (data: string[]) => void
  url: string
}

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!")
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!")
  }
  return isJpgOrPng && isLt2M
}

export default function UploadMultiImage(props: Readonly<Props>) {
  const [state, dispatch] = useReducer(uploadMultiImageReducer, {
    url: [],
    file: [],
  })
  const connect = useConnect((s) => s.connect)
  const handleChange: UploadProps["onChange"] = useCallback(
    (info: UploadChangeParam<UploadFile<Response[]>>) => {
      if (info.file.status == "done") {
        info.file.url = info.file.response![0].url
        if (!info.file.url.startsWith("http"))
          info.file.url = connect.defaults.baseURL! + info.file.url
        dispatch({ type: "addUrl", payload: info.file.response![0].url })
        props.onChange?.(state.url.concat(info.file.response![0].url))
      }
      dispatch({ type: "updateFile", payload: info.fileList })
    },
    [connect.defaults.baseURL, props, state.url],
  )
  useEffect(() => {
    if (props.value != null) {
      dispatch({ type: "updateUrl", payload: props.value })
    }
  }, [props.value])

  return (
    <Upload
      onChange={handleChange}
      beforeUpload={beforeUpload}
      method="POST"
      name="file"
      multiple={true}
      listType="picture-card"
      fileList={state.file}
      action={[connect.defaults.baseURL, props.url].join("/")}
      headers={Object.fromEntries(
        Object.entries(connect.defaults.headers).map(
          (i) => [i[0], i[1]?.toString()] as [string, string],
        ),
      )}
    >
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    </Upload>
  )
}
