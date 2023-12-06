import { PlusOutlined } from "@ant-design/icons"
import { Upload, UploadFile, message } from "antd"
import { useCallback, useEffect, useState } from "react"
import { connect } from "../../lib/Axios"
import { RcFile, UploadChangeParam, UploadProps } from "antd/es/upload"

type Props = {
  imageUrls?: string[]
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

type Response = {
  url: string
}

export default function UploadMultiImage(props: Readonly<Props>) {
  const [value, setValue] = useState(props.value)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const handleChange: UploadProps["onChange"] = useCallback(
    (info: UploadChangeParam<UploadFile<Response[]>>) => {
      if (info.file.status == "done") {
        info.file.url = connect.defaults.baseURL! + info.file.response![0].url
      }
      props.onChange?.(
        info.fileList
          .filter((i) => i.url != null)
          .map((i) => i.response![0].url),
      )
      setFileList(info.fileList)
    },
    [props],
  )
  useEffect(() => {
    setValue(props.value)
  }, [props.value])
  useEffect(() => {
    if (props.imageUrls) {
      setFileList(props.imageUrls.map((i) => ({}) as UploadFile))
    }
  }, [props.imageUrls])
  return (
    <Upload
      onChange={handleChange}
      beforeUpload={beforeUpload}
      method="POST"
      name="file"
      multiple={true}
      listType="picture-card"
      fileList={fileList}
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
