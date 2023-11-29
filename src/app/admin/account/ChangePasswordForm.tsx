"use client";
import { Form, Input, Modal } from "antd";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { ChangePasswordModel } from "./type";
import { connect } from "@/lib/Axios";
type Ref = {
  show(id: string): void;
  hide(): void;
};
export { type Ref as ChangePasswordRef };
export default forwardRef(ChangePasswordForm);
function ChangePasswordForm(props: Readonly<{}>, ref: ForwardedRef<Ref>) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>();
  const [form] = Form.useForm<ChangePasswordModel>();
  useImperativeHandle(
    ref,
    () => ({
      show(id) {
        setId(id);
        setOpen(true);
      },
      hide() {
        setOpen(false);
      },
    }),
    [],
  );
  useEffect(() => {
    if (id != null) {
      form.resetFields();
      form.setFieldsValue({});
    }
  }, [form, id]);
  const handleFinish = useCallback((data: ChangePasswordModel) => {
    delete data["newPassword2"];
    connect.post("api/account/changePassword", data).then((res) => {
      setOpen(false);
    });
  }, []);
  return (
    <Modal
      open={open}
      title="Đổi mật khẩu"
      onCancel={() => {
        setOpen(false);
      }}
      onOk={() => {
        form.submit();
      }}
    >
      <Form<ChangePasswordModel>
        labelCol={{ span: 8 }}
        onFinish={handleFinish}
        form={form}
        autoComplete="off"
      >
        <Form.Item<ChangePasswordModel>
          label="Mật khẩu cũ"
          name={"oldPassword"}
          required
          validateFirst
          rules={[
            {
              required: true,
              message: "Nhập mật khẩu hiện tại của tài khoản này",
            },
          ]}
        >
          <Input.Password autoComplete="off" />
        </Form.Item>
        <Form.Item<ChangePasswordModel>
          label="Mật khẩu mới"
          name={"newPassword"}
          required
          validateFirst
          rules={[
            {
              required: true,
              message: "Nhập mật khẩu hiện tại của tài khoản này",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<ChangePasswordModel>
          label="Nhập lại mật khẩu mới"
          name={"newPassword2"}
          required
          validateFirst
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Nhập mật khẩu hiện tại của tài khoản này",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword2") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không trùng!"));
              },
            }),
          ]}
        >
          <Input.Password autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
