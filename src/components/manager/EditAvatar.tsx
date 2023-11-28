"use client";
import { useRef, useState } from "react";
import { connect } from "@/lib/Axios";
import { Button, Card, Col, Image, Popconfirm, Row, Space } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

export function EditAvatar(
  props: Readonly<{ value?: string; onChange?: (value: string) => void }>,
) {
  const [url, setUrl] = useState(connect.defaults.baseURL! + props.value);
  const [lock, setLock] = useState(false);
  const [preview, setPreview] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  return (
    <>
      <Card className="w-fit overflow-hidden" bodyStyle={{ padding: 0 }}>
        <Image
          width={"100%"}
          src={url}
          className="aspect-square object-cover"
          preview={
            preview
              ? {
                  visible: true,
                  onVisibleChange: (e) => {
                    if (!e) setPreview(false);
                  },
                }
              : false
          }
          onMouseEnter={() => {
            if (!lock) card.current?.classList.remove("hidden");
          }}
        />
        <Card
          ref={card}
          className="absolute w-full h-full hidden bg-black/50 z-10 top-0 duration-700"
          bodyStyle={{ width: "100%", height: "100%" }}
          onMouseLeave={() => {
            if (!lock) card.current?.classList.add("hidden");
          }}
        >
          <Row className="w-full h-full" justify={"center"} align={"middle"}>
            <Col>
              <Space>
                <Popconfirm
                  title={"bạn có chắc xoá ảnh này?"}
                  onConfirm={() => {
                    card.current?.classList.add("hidden");
                    setLock(true);
                    setUrl("#");
                  }}
                  onOpenChange={(e) => {
                    if (!e) setLock(false);
                  }}
                  onCancel={() => {
                    setLock(false);
                  }}
                >
                  <Button
                    type={"primary"}
                    danger
                    onClick={() => {
                      setLock(true);
                    }}
                  >
                    <DeleteOutlined /> xoá ảnh
                  </Button>
                </Popconfirm>
                <Button
                  type={"primary"}
                  onClick={() => {
                    setPreview(true);
                  }}
                >
                  <EyeOutlined /> xem ảnh
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </Card>
      <Button />
    </>
  );
}