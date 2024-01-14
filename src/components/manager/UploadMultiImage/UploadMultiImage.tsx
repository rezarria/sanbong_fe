import { PlusOutlined } from "@ant-design/icons"
import { Upload, UploadFile, message } from "antd"
import { useCallback, useEffect, useReducer, useState } from "react"
import { RcFile, UploadChangeParam, UploadProps } from "antd/es/upload"
import { uploadMultiImageReducer } from "./UploadMultiImageReducer"
import useConnect from "@/store/useConnect"
import config from "@/config/Config"

type Props = {
  value?: string[]
  onChange?: (data: string[]) => void
  url: string
}

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type.startsWith("image/")
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!")
  }
  return isJpgOrPng
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
          info.file.url = config.baseUrl + info.file.url
      }
      dispatch({ type: "updateFile", payload: { files: info.fileList } })
    },
    [],
  )

  useEffect(() => {
    if (props.value != null) {
      dispatch({ type: "updateUrl", payload: props.value })
    }
  }, [props.value])

  const [firstRun, setFirstRun] = useState(true)

  useEffect(() => {
    if (!firstRun) {
      const valueSet = new Set<string>()
      const currentSet = new Set<string>()
      if (props.value) props.value.forEach((i) => valueSet.add(i))
      state.url.forEach((i) => currentSet.add(i))
      if (
        !(
          valueSet.size === currentSet.size &&
          [...valueSet].every((v) => currentSet.has(v))
        )
      ) {
        props.onChange?.(state.url)
      }
    } else setFirstRun(false)
  }, [firstRun, props, state.url])

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
