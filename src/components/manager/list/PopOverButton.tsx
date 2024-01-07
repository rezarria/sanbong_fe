import { Button, ButtonProps, Popover } from "antd"

export default function PopOverButton(props: Readonly<ButtonProps>) {
  return (
    <Popover content={props.content}>
      <Button {...props}>{props.children}</Button>
    </Popover>
  )
}
