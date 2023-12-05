"use client"

import { connect } from "@/lib/Axios"
import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  FormItemProps,
  Input,
  InputProps,
  Modal,
  Space,
  Spin,
} from "antd"
import { NamePath } from "antd/es/form/interface"
import { HttpStatusCode } from "axios"
import { ReactNode, useState } from "react"
import UserAvatar from "../../app/admin/user/UserAvatar"

type Props<T extends Record<string, any>> = Readonly<{
  title: string;
  url: string;
  sections: {
    label: string;
    name: NamePath<T>;
    type?: InputProps["type"];
    input?: ReactNode;
    required?: FormItemProps["required"];
    tooltip?: FormItemProps["tooltip"];
    dependencies?: FormItemProps["dependencies"];
    validateFirst?: FormItemProps["validateFirst"];
    rules?: FormItemProps["rules"];
    ignore?: boolean;
  }[];
  onClose?: () => void;
}>;

export default function Add<T extends Record<string, any>>(props: Props<T>) {
  const [isSpining, setIsSpining] = useState(false)
  const [form] = Form.useForm<T>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => setIsModalOpen(true)
  const handleOk = () => {
    form.submit()
  }
  const handleCancel = () => setIsModalOpen(false)
  const onFinish = (data: T) => {
    setIsSpining(true)
    props.sections
      .filter((i) => i.ignore != null && i.ignore)
      .forEach((section) => {
        delete data[section.name as string]
      })
    connect.post<T>(props.url, data).then((res) => {
      if (res.status === HttpStatusCode.Ok) {
        setIsSpining(false)
        setIsModalOpen(false)
        form.resetFields()
        props.onClose?.()
      }
    })
  }
  return (
    <Space>
      <Button type="primary" onClick={showModal}>
        Tạo mới
      </Button>
      <Modal
        title={props.title}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Spin spinning={isSpining}>
          <Form
            name="basic"
            labelAlign="left"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            method={"POST"}
            form={form}
            scrollToFirstError
          >
            {props.sections.map((item) => (
              <Form.Item<T>
                label={item.label}
                name={item.name}
                key={item.name as string}
                required={item.required}
                tooltip={item.tooltip}
                dependencies={item.dependencies}
                rules={item.rules}
                validateFirst={item.validateFirst}
              >
                {selectInput(item)}
              </Form.Item>
            ))}
          </Form>
        </Spin>
      </Modal>
    </Space>
  )
}

type SelectInput<T extends Record<string, any>> =
  Props<T>["sections"] extends readonly (infer T)[] ? T : never;

function selectInput<T extends Record<string, any>>(section: SelectInput<T>) {
  if (section.input) return section.input
  if (!section.type) return <Input />
  switch (section.type) {
    case "avatar":
      return (
        <>
          <UserAvatar url="api/files" name={section.name as string} />
          {/* <Input className="hidden" /> */}
        </>
      )
    case "datepicker":
      return <DatePicker format={"DD-MM-YYYY"} className="w-full" />
    default:
      return <Input type={section.type} />
  }
}
