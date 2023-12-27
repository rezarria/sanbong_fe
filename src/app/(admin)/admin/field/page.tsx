"use client"

import { Button, Flex, Image, Input, Space } from "antd"
import { useRef } from "react"
import { EditOutlined, EyeOutlined } from "@ant-design/icons"
import Edit, { EditRef } from "@/components/manager/EditNoPatch"
import List, { Ref as ListRef } from "@/components/manager/List"
import Add from "@/components/manager/Add"
import DeleteButton from "@/components/manager/DeleteButton"
import { AddType, EditModel, ListType, ViewModel } from "./type"
import TextArea from "antd/es/input/TextArea"
import UploadMultiImage from "@/components/manager/UploadMultiImage/UploadMultiImage"
import EditTime, { EditTimeRef } from "./EditTime"
import ForwardedRefCustomDescriptions, {
  CustomDescriptionRef,
} from "@/components/CustomDescriptions"
import Paragraph from "antd/es/typography/Paragraph"
import CurrentFieldStatus, { CurrentFieldStatusRef } from "./CurrentFieldStatus"
import config from "@/config/Config"
import ImageList from "@/components/ImageList"
import MonacoInput from "../../../../components/manager/MonocoInput"

const MyList = List<ListType>()
const MyEdit = Edit<EditModel>()
const MyDescription = ForwardedRefCustomDescriptions<ViewModel>()

export default function Page() {
  const listRef = useRef<ListRef>(null)
  const editRef = useRef<EditRef>(null)
  const editTimeRef = useRef<EditTimeRef>(null)
  const descriptionRef = useRef<CustomDescriptionRef>(null)
  const fieldStatusRef = useRef<CurrentFieldStatusRef>(null)

  return (
    <Flex vertical={true} className="h-full" gap={15}>
      <Add<AddType>
        title={"Thêm sân"}
        url={"api/field"}
        sections={[
          { label: "Tên sân", name: "name" },
          {
            label: "Hình ảnh",
            name: "pictures",
            input: <UploadMultiImage url="api/files" />,
          },
          {
            label: "Giá",
            name: "price",
            input: <Input suffix="vnđ" />,
          },
          { label: "Mô tả", name: "description", input: <TextArea /> },
        ]}
        onClose={() => {
          listRef.current?.reload()
        }}
      />
      <MyList
        url={"api/field"}
        columnsDef={[
          {
            key: "#",
            title: "#",
            render: (_v, _d, i) => <span>{i + 1}</span>,
          },
          {
            key: "name",
            dataIndex: "name",
            title: "Tên sân",
          },
          {
            key: "buttons",
            title: "Thao tác",
            render(value, record, index) {
              return (
                <Space>
                  <Button
                    title="xem"
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      descriptionRef.current?.show(record.id)
                      fieldStatusRef.current?.run()
                    }}
                  />
                  <Button
                    title="sửa"
                    icon={<EditOutlined />}
                    onClick={() => {
                      editRef.current?.show(record.id)
                    }}
                  />
                  <DeleteButton
                    title="Xoá sân"
                    description="Bạn có chắc chắn xoá sân này"
                    url="api/field"
                    id={[record.id]}
                    onFinish={() => {
                      listRef.current?.reload()
                    }}
                  />
                </Space>
              )
            },
          },
        ]}
        ref={listRef}
      />
      <MyDescription
        ref={descriptionRef}
        url={"api/field"}
        modalTitle="Thông tin về sân"
        column={24}
        layout="horizontal"
        sections={[
          {
            label: "Tên",
            span: 24,
            children: (p) => p.name,
          },
          {
            label: "Ảnh",
            span: 24,
            children: (p) => <ImageList className="" src={p.pictures} />,
          },
          {
            label: "Giá",
            span: 12,
            children: (p) => p.price,
          },
          {
            label: "Trạng thái",
            span: 12,
            children: (p) => (
              <CurrentFieldStatus ref={fieldStatusRef} fieldId={p.id} />
            ),
          },
          {
            label: "Miêu tả",
            span: 24,
            children: (p) => p.description,
          },
        ]}
        button={(id) => (
          <Button
            type="dashed"
            onClick={() => {
              fieldStatusRef.current?.stop()
              descriptionRef.current?.hide()
              editRef.current?.show(id)
            }}
          >
            <EditOutlined />
            sửa
          </Button>
        )}
      />
      <EditTime ref={editTimeRef} />
      <MyEdit
        url="api/field"
        button={(id) => (
          <Button
            onClick={() => {
              editRef.current?.hide()
              editTimeRef.current?.show(id)
            }}
            type="dashed"
            title="Thay đổi cách đặt"
          >
            Thay đổi cách đặt
          </Button>
        )}
        name="sân"
        ref={editRef}
        onComplete={() => {
          listRef.current?.reload()
        }}
        sections={[
          { name: "name", label: "Tên sân" },
          {
            name: "images",
            label: "Hình ảnh",
            input: <UploadMultiImage url={"api/files"} />,
          },
          {
            name: "price",
            label: "Giá",
            input: (
              <Input type="number" suffix="vnd" placeholder="Chưa đặt giá" />
            ),
          },
          {
            name: "description",
            label: "Mô tả",
            input: <MonacoInput />,
          },
        ]}
      />
    </Flex>
  )
}
