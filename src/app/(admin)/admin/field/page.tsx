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
import EditTime, { EditTimeRef } from "./EditTime"
import ForwardedRefCustomDescriptions, {
  CustomDescriptionRef,
} from "@/components/CustomDescriptions"
import CurrentFieldStatus, { CurrentFieldStatusRef } from "./CurrentFieldStatus"
import ImageList from "@/components/ImageList"
import MonacoInput from "@/components/manager/MonocoInput"
import Table, { TableRef } from "@/components/manager/list/Table"
import TableRowButton from "@/components/manager/list/TableRowButton"

const MyList = List<ListType>()
const FieldTable = Table<ListType>()
const MyEdit = Edit<EditModel>()
const MyDescription = ForwardedRefCustomDescriptions<ViewModel>()

export default function Page() {
  const tableRef = useRef<TableRef>(null)
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
      <FieldTable
        ref={tableRef}
        url="api/field"
        columns={[
          {
            dataIndex: "name",
            title: "Tên sân",
          },
        ]}
        buttonColRender={(v: string, r, i) => (
          <TableRowButton
            id={v}
            onView={() => {
              descriptionRef.current?.show(r.id)
              fieldStatusRef.current?.run()
            }}
            onEdit={() => {
              editRef.current?.show(r.id)
            }}
            onDelete={() => {
              tableRef.current?.update()
            }}
            url="api/field"
            description={"xóa sân " + r.name}
            title="Xóa Sân"
          />
        )}
      />
      <MyDescription
        ref={descriptionRef}
        url={"api/field"}
        modalTitle="Thông tin về sân"
        column={24}
        layout="horizontal"
        onClose={() => {
          fieldStatusRef.current?.stop()
        }}
        sections={[
          {
            label: "Tên",
            span: 24,
            children: (p) => p.name,
          },
          {
            label: "Ảnh",
            span: 24,
            children: (p) => <ImageList className="" src={p.images} />,
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
            input: <MonacoInput />,
          },
        ]}
      />
    </Flex>
  )
}
