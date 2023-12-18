import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Form, Input } from "antd"
import { useRouter } from "next/navigation"
import useAuth from "@/store/useAuth"
import useConnect from "@/store/useConnect"
import { useCallback } from "react"

type LoginModel = {
  username: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const auth = useAuth()
  const connect = useConnect((s) => s.connect)
  const onFinish = useCallback(
    (data: LoginModel) => {
      connect
        .post<{ jwt: string; refesh: string }>("api/security/login", data)
        .then((res) => {
          localStorage.setItem("jwt", res.data.jwt)
          localStorage.setItem("refesh", res.data.refesh)
          auth.updateJwt(res.data.jwt, res.data.refesh)
          router.push("/admin/user")
        })
    },
    [auth, connect, router],
  )

  return (
    <Form<LoginModel>
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item<LoginModel>
        name="username"
        rules={[{ required: true, message: "Please input your Username!" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item<LoginModel>
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button w-full"
        >
          Log in
        </Button>
      </Form.Item>
    </Form>
  )
}
