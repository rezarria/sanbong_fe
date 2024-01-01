"use client"

import { Form, InputNumber } from "antd"
import { Order } from "./type"
import useConsumerProduct from "@/hooks/useConsumerProduct"
import { FieldSelectInputRef } from "@/components/manager/FieldSelectInput"

type Props = {
  fieldRef: FieldSelectInputRef | null
}

export default function TotalMoney(props: Readonly<Props>) {
  const form = Form.useFormInstance<Order>()
  const details = Form.useWatch("details", form)
  const from = Form.useWatch("from", form)
  const to = Form.useWatch("to", form)
  const products = useConsumerProduct()

  const productMoney = details
    ? details
        .map((i) => {
          if (i && i.consumerProductId) {
            const product = products.data.get(i.consumerProductId)
            if (product) {
              return i.count * product.price
            }
          }
          return 0
        })
        .reduce((p, cv) => p + cv)
    : 0
  const field = props.fieldRef?.getField()
  let fieldMoney = 0
  if (from && to && field) {
    from.millisecond(0)
    from.second(0)
    to.millisecond(0)
    to.second(0)
    const diff = Math.floor(to.diff(from) / 1000 / 60) / 60
    fieldMoney = diff * field.price
    console.log(fieldMoney)
  }
  return (
    <Form.Item label="Tổng tiền" preserve>
      <InputNumber
        addonAfter="vnđ"
        readOnly
        value={productMoney + fieldMoney}
      />
    </Form.Item>
  )
}
