"use client"

import { Button, Flex, Input } from "antd"
import { useRef } from "react"
import { EditOutlined } from "@ant-design/icons"
import Edit, { EditRef } from "@/components/manager/EditNoPatch"
import List from "@/components/manager/List"
import Add from "@/components/manager/Add"
import { AddType, EditModel, ListType, ViewModel } from "./type"
import TextArea from "antd/es/input/TextArea"
import UploadMultiImage from "@/components/manager/UploadMultiImage/UploadMultiImage"
import ImageViews from "@/components/manager/ImageViews"
import ForwardedRefCustomDescriptions, {
  CustomDescriptionRef,
} from "@/components/CustomDescriptions"
import Table, { TableRef } from "@/components/manager/list/Table"
import TableRowButton from "@/components/manager/list/TableRowButton"

const MyList = List<ListType>()
const MyTable = Table<ListType>()
const MyDescription = ForwardedRefCustomDescriptions<ViewModel>()
const MyEdit = Edit<EditModel>()

export default function Page() {
  const viewRef = useRef<CustomDescriptionRef>(null)
  const editRef = useRef<EditRef>(null)
  const tableRef = useRef<TableRef>(null)

  return (
    <Flex vertical={true} className="h-full" gap={15}>
      <Add<AddType>
        title={"Thêm sân"}
        url={"api/consumerProduct"}
        sections={[
          { label: "Tên sân", name: "name" },
          {
            label: "Hình ảnh",
            name: "images",
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
          tableRef.current?.update()
        }}
      />
      <MyTable
        ref={tableRef}
        url="api/consumerProduct"
        buttonColRender={(v: string, r, i) => (
          <TableRowButton
            id={v}
            title="Xóa sản phẩm"
            description={<></>}
            url="api/consumerProduct"
            onView={() => {
              viewRef.current?.show(r.id)
            }}
            onDelete={() => {
              tableRef.current?.update()
            }}
            onEdit={() => {
              editRef.current?.show(r.id)
            }}
          />
        )}
        columns={[
          {
            dataIndex: "name",
            title: "Tên sản phẩm",
          },
        ]}
      />
      <MyDescription
        modalTitle="Sản phẩm tiêu thụ"
        layout="vertical"
        ref={viewRef}
        column={24}
        url="api/consumerProduct"
        sections={[
          {
            label: "Tên sân",
            span: 24,
            children: (data) => data.name,
          },
          {
            label: "Giá",
            span: 24,
            children: (data) => data.price,
          },
          {
            label: "Hình ảnh",
            span: 24,
            children: (data) => <ImageViews value={data.images} />,
          },
          {
            label: "Miêu tả",
            span: 24,
            children: (data) => data.description,
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
        url="api/consumerProduct"
        name="sân"
        ref={editRef}
        onComplete={() => {
          tableRef.current?.update()
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
            input: <TextArea />,
          },
        ]}
      />
    </Flex>
  )
}
