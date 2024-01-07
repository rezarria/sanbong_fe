import { RouterItems } from "@/components/AppBreadcrumb/type"
import {
  LockOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons"
import FootballIcon from "@/icon/FootballIcon"

const routerItems: RouterItems[] = [
  {
    name: "field",
    src: "/admin/field",
    title: "Sân",
    icon: <FootballIcon />,
  },
  {
    name: "order",
    src: "/admin/order",
    title: "Đặt sân",
    icon: <FootballIcon />,
  },
  {
    name: "bill",
    src: "/admin/bill",
    title: "Hóa đơn",
    icon: <FootballIcon />,
  },
  {
    name: "organization",
    src: "/admin/organization",
    title: "Tổ chức",
    icon: <FootballIcon />,
  },
  {
    name: "comsuerProduct",
    src: "/admin/cosumerProduct",
    title: "Sản phẩm tiêu thụ",
    icon: <FootballIcon />,
  },
  {
    name: "role",
    src: "/admin/role",
    title: "Quyền",
    icon: <ThunderboltOutlined />,
  },
  {
    name: "user",
    src: "/admin/user",
    title: "Người dùng",
    icon: <UserOutlined />,
    children: [
      {
        name: "account2",
        src: "/admin/account",
        title: "Tài khoản",
        icon: <LockOutlined />,
      },
      {
        name: "user2",
        src: "/admin/user",
        title: "Người dùng",
        icon: <LockOutlined />,
      },
      {
        name: "staff",
        src: "/admin/staff",
        title: "Nhân viên",
        icon: <LockOutlined />,
      },
      {
        name: "customer",
        src: "/admin/customer",
        title: "Khách hàng",
        icon: <LockOutlined />,
      },
    ],
  },
  { type: "divider" },
  {
    name: "account",
    src: "/admin/account",
    title: "Tài khoản",
    icon: <LockOutlined />,
  },
  {
    name: "login",
    src: "/admin/login",
    title: "Đăng nhập",
    icon: <UserOutlined />,
  },
]

export default routerItems
