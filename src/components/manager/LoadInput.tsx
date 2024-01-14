import { Form, InputNumber, InputNumberProps } from "antd"
import { Dayjs } from "dayjs"

type Props = InputNumberProps<number> & {
  duration?: number
}

export default function LoadInput(props: Readonly<Props>) {
  const form = Form.useFormInstance()
  return (
    <InputNumber
      {...props}
      onChange={(v) => {
        props.onChange?.(v)
        if (!props.disabled && props.duration && v) {
          const data: Dayjs = form.getFieldValue("from")
          const to = data.add(v * props.duration, "minute")
          form.setFieldValue("to", to)
        }
      }}
    />
  )
}
