import { Form } from "antd"
import FieldCalendar from "./FieldCalendar"
import { Order } from "./type"

export default function WrapperFieldCalendar() {
  const form = Form.useFormInstance<Order>()
  const fieldId = Form.useWatch("fieldId", form)
  return <FieldCalendar fieldId={fieldId} />
}
