"use client"
import { Button, Col, Form, Input, Row, message } from "antd"
import { Order } from "./type"
import FieldSelectInput, {
  FieldSelectInputRef,
} from "@/components/manager/FieldSelectInput"
import { useEffect, useMemo, useRef } from "react"
import CustomerSelectInput from "@/components/manager/CustomerSelectInput"
import PaymentMethod from "./PaymentMethod"
import Details from "./Details"
import useFieldUnitSetting from "./useFieldUnitSetting"
import TotalMoney from "./TotalMoney"
import WrapperFieldCalendar from "./WrapperFieldCalendar"
import FromToTimeInput from "./FromToTimeInput"

export default function Page() {
  const [setting, getSetting] = useFieldUnitSetting()
  const [form] = Form.useForm<Order>()
  useEffect(() => {
    if (setting) form.setFieldValue("fieldUnitSettingId", setting.id)
  }, [setting, form])
  const fieldInputRef = useRef<FieldSelectInputRef>(null)
  const startTime = useMemo(() => {
    if (setting) {
      const date = new Date()
      date.setMilliseconds(0)
      date.setHours(0)
      date.setMinutes(setting?.openTime)
      date.setSeconds(0)
      return date
    }
  }, [setting])
  const endTime = useMemo(() => {
    if (setting) {
      const date = new Date()
      date.setMilliseconds(0)
      date.setHours(0)
      date.setMinutes(setting?.closeTime)
      date.setSeconds(0)
      return date
    }
  }, [setting])
  return (
    <Form<Order> layout="vertical" form={form}>
      <Row gutter={15}>
        <Col span={12}>
          <Form.Item<Order> label="Sân" name={"fieldId"}>
            <FieldSelectInput
              ref={fieldInputRef}
              onChange2={(id) => {
                if (id) getSetting(id)
              }}
              onChange3={(d) => {
                form.setFieldValue("priceId", d?.priceId)
              }}
            />
          </Form.Item>
          <Form.Item<Order> name={"fieldUnitSettingId"} hidden>
            <Input />
          </Form.Item>
          <Form.Item<Order> name={"priceId"} hidden>
            <Input />
          </Form.Item>
          <Form.Item<Order> label="Khách hàng" name={"customerId"}>
            <CustomerSelectInput />
          </Form.Item>
          <FromToTimeInput
            startTime={startTime}
            endTime={endTime}
            setting={setting}
          />
          <Form.Item<Order>
            label={`Số ${
              setting?.unitName ?? "..."
            } (${setting?.duration} phút)`}
          >
            <Input
              type="number"
              disabled={setting == null || !setting.unitStyle}
            />
          </Form.Item>
          <PaymentMethod />
          <TotalMoney fieldRef={fieldInputRef.current} />
          <Button
            type="primary"
            onClick={() => {
              message.info({ content: JSON.stringify(form.getFieldsValue()) })
            }}
          >
            Tạo
          </Button>
        </Col>
        <Col span={12}>
          <Details />
          <WrapperFieldCalendar />
        </Col>
      </Row>
    </Form>
  )
}
