"use client";

import { Button, Modal } from "antd";
import { useState } from "react";

export default function Add() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Tạo mới
      </Button>
      <Modal
        title="thêm tài khoản"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
}
