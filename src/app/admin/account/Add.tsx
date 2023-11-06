"use client";

import { Button, Form, Input, Modal, Space, Spin } from "antd";
import { useState } from "react";

type AddType = {
  username?: string;
  password?: string;
};

export default function Add() {
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
    setTimeout(() => {
      setIsSpining(false);
    }, 2000);
  };
  return (
    <Space>
      <Button type="primary" onClick={showModal}>
        Tạo mới
      </Button>
      <Modal
        title="Thêm tài khoản"
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
            <Form.Item<AddType> label="Tên tài khoản" name="username">
              <Input />
            </Form.Item>
            <Form.Item<AddType> label="Mật khẩu" name="password">
              <Input.Password />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </Space>
  );
}
