"use client"

import { Button, Flex, Form, Image } from "antd"
import { useRef } from "react"
import { EditOutlined } from "@ant-design/icons"
import ViewComponent, { ViewRef } from "@/components/manager/View"
import Edit, { EditRef } from "@/components/manager/Edit"
import Add from "@/components/manager/Add"
import { AddModel, EditModel, ListModel, ViewModel } from "./type"
import UserAvatar from "@/components/manager/UserAvatar"
import useConnect from "@/store/useConnect"
import RoleSelectInput, {
  RoleSelectInputProps,
} from "@/components/manager/RoleSelectInput"
import AccountSelectInput from "@/components/manager/AccountSelectInput"
import Table, { TableRef } from "@/components/manager/list/Table"
import TableRowButton from "@/components/manager/list/TableRowButton"
import ForwardedRefCustomDescriptions, {
  CustomDescriptionRef,
} from "@/components/CustomDescriptions"

const MyTable = Table<ListModel>()
const MyDescription = ForwardedRefCustomDescriptions<ViewModel>()
const MyView = ViewComponent<ViewModel>()
const MyEdit = Edit<EditModel>()

export default function Page() {
  const tableRef = useRef<TableRef>(null)
  const descriptionRef = useRef<CustomDescriptionRef>(null)
  const viewRef = useRef<ViewRef>(null)
  const editRef = useRef<EditRef>(null)
  const connect = useConnect((s) => s.connect)

  return (
    <Flex vertical={true} className="h-full">
      <Add<AddModel>
        title={"Thêm nhân viên mới"}
        url={"api/staff"}
        sections={[
          { label: "Tên", name: "name" },
          { label: "Ngày sinh", name: "dob", type: "datepicker" },
          { label: "Username", name: "username", required: true },
          { label: "Email", name: "email" },
          { label: "Mật khẩu", name: "password" },
          {
            label: "Quyền",
            name: "roles",
            required: true,
            validateFirst: true,
            input: <WrapRoleSelectInput />,
            rules: [
              {
                required: true,
                message: "Hãy chọn tối thiểu một quyền",
              },
            ],
          },
          {
            label: "Tài khoản",
            name: "accountId",
            required: true,
            validateFirst: true,
            input: <AccountSelectInput />,
          },
          {
            label: "Avatar",
            name: "avatar",
            type: "avatar",
          },
        ]}
        onClose={() => {
          tableRef.current?.update()
        }}
      />
      <MyTable
        url="api/staff"
        ref={tableRef}
        buttonColRender={(v: string, r, i) => (
          <TableRowButton
            url="api/staff"
            description="Xóa Nhân viên"
            title="Xóa nhân viên"
            id={v}
            onView={() => {
              descriptionRef.current?.show(v)
            }}
            onEdit={() => {
              editRef.current?.show(v)
            }}
            onDelete={() => {
              tableRef.current?.update()
            }}
          />
        )}
        columns={[
          {
            dataIndex: "name",
            title: "Tên nhân viên",
          },
        ]}
      />
      <MyDescription
        column={24}
        layout="horizontal"
        modalTitle="Thông tin nhân viên"
        url="api/staff"
        ref={descriptionRef}
        sections={[
          {
            label: "Tên",
            span: 24,
            children: (data) => data.name,
          },
          {
            label: "Ngày sinh",
            children: (data) => data.dob,
          },
          {
            label: "Avatar",
            span: 24,
            children: (data) => (
              <Image
                className="relative"
                src={connect.defaults.baseURL + data.avatar}
                alt="avatar"
              />
            ),
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
            <EditOutlined /> Sửa
          </Button>
        )}
      />
      <MyEdit
        url="api/user"
        name="người dùng"
        ref={editRef}
        onComplete={() => {
          tableRef.current?.update()
        }}
        sections={[
          { name: "name", label: "Tên" },
          {
            name: "dob",
            label: "Ngày sinh",
            type: "datepicker",
          },
          {
            name: "avatar",
            label: "Ảnh đại diện",
            type: "avatar",
          },
        ]}
      >
        <EditAvatar />
      </MyEdit>
    </Flex>
  )
}

function EditAvatar() {
  const avatar = Form.useWatch("avatar", Form.useFormInstance<EditModel>())
  return (
    <Form.Item>
      <UserAvatar url="api/files" value={avatar} />
    </Form.Item>
  )
}

function WrapRoleSelectInput(props: Readonly<RoleSelectInputProps>) {
  return <RoleSelectInput value={props.value} onChange={props.onChange} />
}
