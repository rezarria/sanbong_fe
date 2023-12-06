"use client"

import { Button, Flex, Input, Space } from "antd"
import { useRef } from "react"
import { EditOutlined, EyeOutlined } from "@ant-design/icons"
import ViewComponent, { ViewRef } from "@/components/manager/View"
import Edit, { EditRef } from "@/components/manager/Edit"
import List, { Ref as ListRef } from "@/components/manager/List"
import Add from "@/components/manager/Add"
import DeleteButton from "@/components/manager/DeleteButton"
import { AddType, EditModel, ListType, ViewModel } from "./type"
import TextArea from "antd/es/input/TextArea"
import UploadMultiImage from "@/components/manager/UploadMultiImage/UploadMultiImage"
import ImageViews from "@/components/manager/ImageViews"

const MyList = List<ListType>()
const MyView = ViewComponent<ViewModel>()
const MyEdit = Edit<EditModel>()

export default function Page() {
  const listRef = useRef<ListRef>(null)
  const viewRef = useRef<ViewRef>(null)
  const editRef = useRef<EditRef>(null)

  return (
    <Flex vertical={true} className="h-full">
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
                      viewRef.current?.show(record.id)
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
      <MyView
        ref={viewRef}
        url={"api/field"}
        modalTitle="Thông tin về sân"
        sections={[
          {
            label: "Tên sân",
            title: "name",
            name: "name",
          },
          {
            label: "Giá",
            title: "price",
            name: "price",
            input: (data) => (
              <Input readOnly value={data.price} suffix={"vnđ"} />
            ),
          },
          {
            label: "Hình ảnh",
            title: "pictures",
            name: "pictures",
            input: (data) => <ImageViews value={data.pictures} />,
          },
          {
            label: "Miêu tả",
            title: "description",
            name: "description",
            input: (data) => <TextArea value={data.description} readOnly />,
          },
        ]}
        button={(id) => (
          <Button
            type="dashed"
            onClick={() => {
              viewRef.current?.hide()
              editRef.current?.show(id)
            }}
          >
            <EditOutlined />
            sửa
          </Button>
        )}
      />
      <MyEdit
        url="api/field"
        name="sân"
        ref={editRef}
        onComplete={() => {
          listRef.current?.reload()
        }}
        sections={[
          { name: "name", label: "Tên sân" },
          {
            name: "pictures",
            label: "Hình ảnh",
            input: <UploadMultiImage url={"api/files"} />,
          },
          {
            name: "description",
            label: "Mô tả",
            input: <TextArea />,
          },
        ]}
      />
    </Flex>
  )
}
