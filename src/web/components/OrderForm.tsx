"use client"
import { Button, Col, Form, Input, Row, notification } from "antd"
import { Order } from "@/components/orderType"
import FieldSelectInput, {
  FieldSelectInputRef,
} from "@/components/manager/FieldSelectInput"
import { useCallback, useEffect, useMemo, useRef } from "react"
import CustomerSelectInput from "@/components/manager/CustomerSelectInput"
import PaymentMethod from "@/components/PaymentMethod"
import Details from "@/components/Details"
import useFieldUnitSetting from "@/components/useFieldUnitSetting"
import TotalMoney from "@/components/TotalMoney"
import WrapperFieldCalendar from "@/components/WrapperFieldCalendar"
import FromToTimeInput from "@/components/FromToTimeInput"
import useConnect from "@/store/useConnect"
import { useRouter } from "next/navigation"

type Props = {
  fieldId: string
}

export default function OrderForm(props: Readonly<Props>) {
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
  const connect = useConnect((s) => s.connect)
  const router = useRouter()
  const submitHandle = useCallback(
    (value: Order) => {
      connect
        .post("api/bill", value)
        .then((res) => {
          notification.success({ message: "tạo đơn thành công", duration: 3 })
          router.push("/admin/bill")
        })
        .catch(() => {
          notification.error({ message: "tạo đơn thất bại", duration: 3 })
        })
    },
    [connect, router],
  )
  useEffect(() => {
    form.setFieldValue("fieldId", props.fieldId)
  }, [form, props.fieldId])
  return (
    <Form<Order> layout="vertical" form={form} onFinish={submitHandle}>
      <Row gutter={15}>
        <Col span={12}>
          <Form.Item<Order> label="Sân" name={"fieldId"}>
            <FieldSelectInput
              readonly={true}
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
              form.submit()
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
