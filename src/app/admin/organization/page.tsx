"use client"

import { Button, Flex, Image, Space } from "antd"
import { useRef } from "react"
import { EditOutlined, EyeOutlined } from "@ant-design/icons"
import List, { Ref as ListRef } from "@/components/manager/List"
import Add from "@/components/manager/Add"
import DeleteButton from "@/components/manager/DeleteButton"
import { AddModel, EditModel2, ListModel, ViewModel } from "./type"
import ForwardedRefCustomDescriptions, {
  CustomDescriptionRef,
} from "@/components/CustomDescriptions"
import EditNoPatch, { Ref as EditRef } from "@/components/manager/EditNoPatch"
import UserAvatar from "@/components/manager/UserAvatar"
import config from "@/config/Config"

const MyList = List<ListModel>()
const MyEdit2 = EditNoPatch<EditModel2>()
const MyDescriptions = ForwardedRefCustomDescriptions<ViewModel>()

export default function Page() {
  const listRef = useRef<ListRef>(null)
  const editRef = useRef<EditRef>(null)
  const descriptionRef = useRef<CustomDescriptionRef>(null)

  return (
    <Flex vertical={true} className="h-full">
      <Add<AddModel>
        title={"Thêm Người dùng mới"}
        url={"api/organization"}
        sections={[
          {
            label: "Tên tổ chức",
            name: "name",
            required: true,
            validateFirst: true,
          },
          {
            label: "Địa chỉ",
            name: "address",
            required: true,
            validateFirst: true,
          },
          {
            label: "Email",
            name: "email",
            required: true,
            validateFirst: true,
          },
          {
            label: "Điện thoại",
            name: "phone",
            required: true,
            validateFirst: true,
          },
          {
            label: "Ảnh",
            name: "image",
            input: <UserAvatar url="api/files" name="image" />,
          },
        ]}
        onClose={() => {
          listRef.current?.reload()
        }}
      />
      <MyList
        url={"api/organization"}
        columnsDef={[
          {
            key: "#",
            title: "#",
            render: (_v, _d, i) => <span>{i + 1}</span>,
          },
          {
            key: "name",
            dataIndex: "name",
            title: "Tên",
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
                    title="Xoá tổ chức này"
                    description="Bạn có chắc chắn xoá tài khoản này"
                    url="api/account"
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

      <MyDescriptions
        column={12}
        ref={descriptionRef}
        url={"api/organization"}
        layout="vertical"
        modalTitle="Thông tin về tổ chức"
        sections={[
          {
            label: "ID",
            children: (data) => data.id,
            span: 12,
          },
          {
            label: "Tên tổ chức",
            span: 12,
            children: (data) => data.name,
          },
          {
            label: "Số điện thoại",
            span: 6,
            children: (data) => data.phone,
          },
          {
            label: "Email",
            span: 6,
            children: (data) => data.email,
          },
          {
            label: "Image",
            span: 12,
            children: (data) => (
              <Image
                className="rounded"
                src={[config.baseUrl, data.image].join("")}
                alt="ảnh tổ chức"
              />
            ),
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

      <MyEdit2
        url="api/organization"
        name="tổ chức"
        ref={editRef}
        onComplete={() => {
          listRef.current?.reload()
        }}
        sections={[
          { name: "name", label: "Tên" },
          {
            name: "phone",
            label: "điện thoại",
          },
          {
            name: "email",
            label: "email",
          },
          {
            name: "address",
            label: "địa chỉ",
          },
          {
            name: "image",
            label: "Ảnh",
            type: "avatar",
          },
        ]}
      />
    </Flex>
  )
}
