"use client"
import { useCallback, useRef, useState } from "react"
import { Button, Card, Col, Image, Popconfirm, Row, Space } from "antd"
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons"
import EditDefaultAvatar from "./EditDefautAvatar"
import EditAvatarUploadButton from "./EditAvatarUploadButton"
import useConnect from "@/store/useConnect"
import config from "../../config/Config"

export function EditAvatar(
  props: Readonly<{ value?: string; onChange?: (value: string) => void }>,
) {
  const [imageUrl, setImageUrl] = useState(props.value)
  const [lock, setLock] = useState(false)
  const connect = useConnect((s) => s.connect)
  const [preview, setPreview] = useState(false)
  const [modalConfig, setModalConfig] = useState({
    preview: props.value != null && props.value.length != 0,
    delete: props.value != null && props.value.length != 0,
    upload: !(props.value != null && props.value.length != 0),
  })
  const card = useRef<HTMLDivElement>(null)
  const handleMouseEnter = useCallback(() => {
    if (!lock) card.current?.classList.remove("hidden")
  }, [lock])
  return (
    <Card
      className="w-full h-full aspect-square overflow-hidden"
      bodyStyle={{ padding: 0, width: "100%", height: "100%" }}
    >
      {imageUrl != null && imageUrl.length != 0 ? (
        <Image
          width={"100%"}
          height={"100%"}
          alt={"avatar"}
          src={config.baseUrl + imageUrl}
          className="aspect-square object-cover"
          preview={
            preview
              ? {
                  visible: true,
                  onVisibleChange: (e) => {
                    if (!e) setPreview(false)
                  },
                }
              : false
          }
          onMouseEnter={handleMouseEnter}
        />
      ) : (
        <EditDefaultAvatar onMouseEnter={handleMouseEnter} />
      )}
      <Card
        ref={card}
        className="absolute w-full h-full hidden bg-black/50 z-10 top-0 duration-700"
        bodyStyle={{ width: "100%", height: "100%" }}
        onMouseLeave={() => {
          if (!lock) card.current?.classList.add("hidden")
        }}
      >
        <Row className="w-full h-full" justify={"center"} align={"middle"}>
          <Col className="max-w-fit">
            <Space>
              {modalConfig.upload && (
                <EditAvatarUploadButton
                  url="api/files"
                  onChange={(url) => {
                    if (url) {
                      props.onChange?.(url)
                      setImageUrl(url)
                      setModalConfig({
                        upload: false,
                        delete: true,
                        preview: true,
                      })
                    }
                  }}
                />
              )}
              {modalConfig.delete && (
                <Popconfirm
                  title={"bạn có chắc xoá ảnh này?"}
                  onConfirm={() => {
                    card.current?.classList.add("hidden")
                    setLock(true)
                    setImageUrl("")
                    props.onChange?.("")
                  }}
                  onOpenChange={(e) => {
                    if (!e) {
                      setLock(false)
                      setModalConfig({
                        upload: true,
                        delete: false,
                        preview: false,
                      })
                    }
                  }}
                  onCancel={() => {
                    setLock(false)
                  }}
                >
                  <Button
                    type={"primary"}
                    danger
                    onClick={() => {
                      setLock(true)
                    }}
                  >
                    <DeleteOutlined /> xoá ảnh
                  </Button>
                </Popconfirm>
              )}
              {modalConfig.preview && (
                <Button
                  type={"primary"}
                  onClick={() => {
                    setPreview(true)
                  }}
                >
                  <EyeOutlined /> xem ảnh
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>
    </Card>
  )
}
