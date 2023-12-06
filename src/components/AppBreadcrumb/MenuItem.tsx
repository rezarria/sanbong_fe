import { MenuProps } from "antd"
import MenuItem from "antd/es/menu/MenuItem"
import { convertItems, flat, structFillter } from "./method"
import routerItems from "@/config/MenuItems"

export const structFlated = flat(structFillter(routerItems))

const items: MenuProps["items"] = convertItems(routerItems)

export { items, routerItems }
export type AppRouterItems = typeof routerItems

export default MenuItem
