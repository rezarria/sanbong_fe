"use client"

import { Button, Flex } from "antd"
import { useRef } from "react"
import { EditOutlined } from "@ant-design/icons"
import { ViewModel } from "./type"
import ForwardedRefCustomDescriptions, {
  CustomDescriptionRef,
} from "@/components/CustomDescriptions"
import Table, { TableRef } from "@/components/manager/list/Table"
import TableRowButton from "@/components/manager/list/TableRowButton"

const BillTable = Table<ViewModel>()
const MyDescriptions = ForwardedRefCustomDescriptions<ViewModel>()

export default function Page() {
  const descriptionRef = useRef<CustomDescriptionRef>(null)
  const tableRef = useRef<TableRef>(null)

  return (
    <Flex vertical={true} className="h-full">
      <BillTable
        ref={tableRef}
        url="api/bill"
        buttonColRender={(id) => (
          <TableRowButton url="api/bill" title="" description="" id={id} />
        )}
        columns={[
          {
            dataIndex: "id",
            title: "id",
          },
        ]}
      />

      <MyDescriptions
        column={12}
        ref={descriptionRef}
        url={"api/bill"}
        layout="vertical"
        modalTitle="Thông tin về tổ chức"
        sections={[
          {
            label: "ID",
            children: (data) => data.id,
            span: 12,
          },
          {
            label: "ID",
            span: 12,
            children: (data) => data.id,
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
            <EditOutlined /> Sửa
          </Button>
        )}
      />
    </Flex>
  )
}
