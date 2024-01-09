import { Form } from "antd"
import FieldCalendar from "@/components/FieldCalendar"
import { Order } from "./orderType"

export default function WrapperFieldCalendar() {
  const form = Form.useFormInstance<Order>()
  const fieldId = Form.useWatch("fieldId", form)
  return <FieldCalendar fieldId={fieldId} />
}
