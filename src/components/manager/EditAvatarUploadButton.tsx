import { UploadOutlined } from "@ant-design/icons"
import { Button, Upload, message } from "antd"
import { useCallback, useRef } from "react"
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload"
import useConnect from "@/store/useConnect"

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type.startsWith("image/")
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!")
  }
  return isJpgOrPng
}

export default function EditAvatarUploadButton(
  props: Readonly<{
    url: string
    onClick?: () => void
    onCancel?: () => void
    onChange?: (url?: string) => void
  }>,
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const connect = useConnect((s) => s.connect)
  const handleChange: UploadProps["onChange"] = useCallback(
    (info: UploadChangeParam<UploadFile>) => {
      if (info.file.status == "done") {
        info.fileList.forEach(
          (i) => (i.url = connect.defaults.baseURL! + i.response[0].url),
        )
        const fileUrl = info.fileList[0].response[0].url
        props.onChange?.(fileUrl)
      }
    },
    [connect.defaults.baseURL, props],
  )
  return (
    <Upload
      method="POST"
      name="file"
      beforeUpload={beforeUpload}
      onChange={handleChange}
      action={[connect.defaults.baseURL, props.url].join("/")}
      headers={Object.fromEntries(
        Object.entries(connect.defaults.headers).map(
          (i) => [i[0], i[1]?.toString()] as [string, string],
        ),
      )}
    >
      <Button
        type="primary"
        onClick={() => {
          inputRef.current?.click()
          props.onClick?.()
        }}
      >
        <UploadOutlined />
        tải ảnh
      </Button>
    </Upload>
  )
}
