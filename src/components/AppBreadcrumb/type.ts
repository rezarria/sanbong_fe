import { MenuProps } from "antd"
import { MenuDividerType, MenuItemGroupType } from "antd/es/menu/hooks/useItems"
import { ReactNode } from "react"

enum Routers {
  Role,
  User,
  Account,
}

export type StructFlatedType = { data: Struct; previous?: StructFlatedType }

export type MenuItem = Required<MenuProps>["items"][number]

export type RouterItems = Struct | MenuItemGroupType | MenuDividerType

export interface Struct {
  src?: string
  title?: string
  name?: string
  icon?: ReactNode
  children?: RouterItems[]
}

export { Routers as RouterEnum }
