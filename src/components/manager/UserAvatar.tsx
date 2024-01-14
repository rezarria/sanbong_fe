import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { Upload, UploadProps, message, Image, Form } from "antd"
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload"
import { useCallback, useEffect, useId, useState } from "react"
import useConnect from "@/store/useConnect"
import config from "@/config/Config"

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type.startsWith("image/")
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!")
  }
  return isJpgOrPng
}

type Props = {
  url: string
  callback?: (uploadFile: UploadFile) => void
  name?: string
  value?: string
  onChange?: (value: string) => void
}

export default function UserAvatar(props: Readonly<Props>) {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [showPreview, setShowPreview] = useState(false)
  const [list, setList] = useState<UploadFile[]>([])
  const form = Form.useFormInstance()
  const id = useId()
  const connect = useConnect((s) => s.connect)
  const handleChange: UploadProps["onChange"] = useCallback(
    (info: UploadChangeParam<UploadFile>) => {
      setLoading(info.file.status == "uploading")
      if (info.file.status == "done") {
        info.fileList.forEach(
          (i) => (i.url = connect.defaults.baseURL! + i.response[0].url),
        )
        const fileUrl = info.fileList[0].response[0].url
        props.onChange?.(fileUrl)
        form.setFieldValue(props.name, fileUrl)
      }
      setList(info.fileList)
    },
    [connect.defaults.baseURL, form, props],
  )

  const onPreview: UploadProps["onPreview"] = useCallback(
    (file: UploadFile) => {
      setImageUrl(file.url)
      setShowPreview(true)
    },
    [],
  )

  useEffect(() => {
    if (props.value != null) {
      setList([
        {
          uid: id,
          name: props.value,
          url: connect.defaults.baseURL + props.value,
        },
      ])
    }
  }, [connect.defaults.baseURL, id, props.value])

  const uploadButton =
    list.length != 1 ? (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    ) : undefined
  return (
    <>
      {imageUrl && (
        <Image
          alt=":v"
          hidden
          preview={{
            src: imageUrl,
            visible: showPreview,
            onVisibleChange: (e) => {
              if (!e) setShowPreview(false)
            },
          }}
        />
      )}
      <Upload
        name="file"
        multiple={false}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={true}
        action={[config.baseUrl, props.url].join("/")}
        headers={Object.fromEntries(
          Object.entries(connect.defaults.headers).map(
            (i) => [i[0], i[1]?.toString()] as [string, string],
          ),
        )}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onPreview={onPreview}
      >
        {uploadButton}
      </Upload>
    </>
  )
}
