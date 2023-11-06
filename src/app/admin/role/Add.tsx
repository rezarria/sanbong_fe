"use client";

import { connect } from "@/lib/Axios";
import { Button, Form, Input, Modal, Space, Spin } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { NamePath } from "antd/es/form/interface";
import { HttpStatusCode } from "axios";
import { useState } from "react";

type AddType = {
  username?: string;
  password?: string;
};

export default function Add<T>(
  props: Readonly<{
    title: string;
    url: string;
    sections: {
      label: string;
      name: NamePath<T>;
    }[];
  }>,
) {
  const [isSpining, setIsSpining] = useState(false);
  const [form] = Form.useForm<AddType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => {
    setIsSpining(true);
    form.submit();
  };
  const handleCancel = () => setIsModalOpen(false);
  const onAction = (data: AddType) => {
    connect.post<T>(props.url, data).then((res) => {
      if (res.status === HttpStatusCode.Ok) {
        setIsSpining(false);
        setIsModalOpen(false);
      }
    });
  };
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
            autoComplete="on"
            labelAlign="left"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onAction}
            method={"POST"}
            form={form}
          >
            {props.sections.map((item) => (
              <Form.Item<T>
                label={item.label}
                name={item.name}
                key={item.name as string}
              >
                <Input />
              </Form.Item>
            ))}
          </Form>
        </Spin>
      </Modal>
    </Space>
  );
}
