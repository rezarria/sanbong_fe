"use client";
import { Button } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { useRef } from "react";
import ChangePasswordForm, { ChangePasswordRef } from "./ChangePasswordForm";

export function ChangePasswordButton(props: Readonly<{ accountId: string }>) {
  const formRef = useRef<ChangePasswordRef>(null);
  return (
    <>
      <Button
        type="primary"
        danger
        onClick={() => {
          formRef.current?.show(props.accountId);
        }}
      >
        <WarningOutlined />
        Đổi mật khẩu
      </Button>
      <ChangePasswordForm ref={formRef} />
    </>
  );
}
