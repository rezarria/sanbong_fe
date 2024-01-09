"use client"

import { Button, Flex, Segmented, Space } from "antd"
import { useRef } from "react"
import { EditOutlined, EyeOutlined } from "@ant-design/icons"
import { EditModel, ViewModel } from "./type"
import ForwardedRefCustomDescriptions, {
  CustomDescriptionRef,
} from "@/components/CustomDescriptions"
import Table, { TableRef } from "@/components/manager/list/Table"
import dayjs from "dayjs"
import Edit, { EditRef } from "@/components/manager/EditNoPatch"
import CustomerSelectInput from "../../../../components/manager/CustomerSelectInput"

const BillTable = Table<ViewModel>()
const BillEdit = Edit<EditModel>()
const MyDescriptions = ForwardedRefCustomDescriptions<ViewModel>()

export default function Page() {
  const descriptionRef = useRef<CustomDescriptionRef>(null)
  const tableRef = useRef<TableRef>(null)
  const editRef = useRef<EditRef>(null)

  return (
    <Flex vertical={true} className="h-full">
      <BillTable
        ref={tableRef}
        url="api/bill"
        buttonColRender={(id) => (
          <Space>
            <Button
              icon={<EyeOutlined />}
              type="primary"
              onClick={() => {
                descriptionRef.current?.show(id)
              }}
            />
          </Space>
        )}
        columns={[
          {
            dataIndex: "id",
            title: "Đơn",
            render: (v, r, i) => (
              <p>
                <span className="font-bold">{r.customer.name}</span>
                {` thuê `}
                <span className="font-bold">{r.fieldHistory.field.name}</span>
                {` từ `}
                <span>{dayjs(r.fieldHistory.from).format("HH:mm")}</span>
                {` đến `}
                <span>{dayjs(r.fieldHistory.to).format("HH:mm")}</span>
              </p>
            ),
          },
          {
            dataIndex: "id",
            title: "Thời gian",
            render: (v, r, i) => dayjs(r.lastModifiedDate).format("DD/MM/YYYY"),
          },
          {
            dataIndex: "id",
            title: "Trạng thái",
            render: (v, r, i) => {
              switch (r.paymentStatus) {
                case "NONE":
                  return "NONE"
                case "PENDING":
                  return "Đang thanh toán"
                case "DONE":
                  return "Đã thanh toán"
                case "ERROR":
                  return "Lỗi"
                case "CANCEL":
                  return "Đã hủy"
              }
            },
          },
        ]}
      />
      <BillEdit
        ref={editRef}
        url="api/bill"
        name="Hóa đơn"
        onComplete={() => {
          tableRef.current?.update()
        }}
        sections={[
          {
            label: "Khách hàng",
            name: "customerId",
            input: <CustomerSelectInput />,
          },
          {
            label: "Trạng thái",
            name: "paymentStatus",
            input: (
              <Segmented
                options={[
                  { value: "PENDING", label: "Đang thanh toán" },
                  { value: "DONE", label: "Đã thanh toán" },
                  {
                    value: "CANCEL",
                    label: "Hủy",
                    className: "bg-red-600 text-white",
                  },
                ]}
              />
            ),
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
            label: "Kiểu thanh toán",
            span: 6,
            children: (data) => data.paymentMethod,
          },
          {
            label: "Trạng thái",
            span: 6,
            children: (data) => {
              switch (data.paymentStatus) {
                case "NONE":
                  return "NONE"
                case "PENDING":
                  return "Đang thanh toán"
                case "DONE":
                  return "Đã thanh toán"
                case "ERROR":
                  return "Lỗi"
                case "CANCEL":
                  return "Đã hủy"
              }
            },
          },
          {
            label: "Sân",
            span: 6,
            children: (data) => data.fieldHistory.field.name,
          },
          {
            label: "Thời gian",
            span: 6,
            children: (data) =>
              `${dayjs(data.fieldHistory.from).format("HH:mm")} đến ${dayjs(
                data.fieldHistory.to,
              ).format("HH:mm")} ngày ${dayjs(data.fieldHistory.to).format(
                "DD/MM",
              )}`,
          },
          {
            label: "Mô tả thêm",
            span: 12,
            children: (data) => data.description,
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
