"use client"

import {
  Button,
  Col,
  Form,
  Input,
  List,
  Row,
  Space,
  Table,
  TimePicker,
} from "antd"
import { Order } from "./type"
import FieldSelectInput from "@/components/manager/FieldSelectInput"
import useConnect from "@/store/useConnect"
import { useCallback, useMemo, useState } from "react"
import CustomerSelectInput from "@/components/manager/CustomerSelectInput"
import PaymentMethod from "./PaymentMethod"
import Details from "./Details"

export default function Page() {
  const [setting, getSetting] = useFieldUnitSetting()
  const [form] = Form.useForm()
  const startTime = useMemo(() => {
    if (setting) {
      const date = new Date()
      date.setMilliseconds(0)
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(setting?.openTime)
      return date
    }
  }, [setting])
  const endTime = useMemo(() => {
    if (setting) {
      const date = new Date()
      date.setMilliseconds(0)
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(setting?.closeTime)
      return date
    }
  }, [setting])
  return (
    <Form<Order>
      layout="vertical"
      form={form}
      onValuesChange={(c, v) => console.log(v)}
    >
      <Row gutter={15}>
        <Col span={12}>
          <Form.Item<Order> label="Sân" name={"fieldId"}>
            <FieldSelectInput
              onChange2={(id) => {
                if (id) getSetting(id)
              }}
            />
          </Form.Item>
          <Form.Item<Order> label="Khách hàng" name={"customerId"}>
            <CustomerSelectInput />
          </Form.Item>
          <Form.Item>
            <Space>
              <Form.Item<Order>
                label="Từ"
                name={"from"}
                className="inline-block"
              >
                <TimePicker
                  format={"HH:mm"}
                  disabledTime={(d) => {
                    return {
                      disabledMinutes(hour) {
                        return Array.from(Array(60).keys()).filter((m) => {
                          if (hour == endTime?.getHours()) {
                            return m < endTime.getMinutes()
                          }
                          if (hour == d.hour()) return m < d.minute()
                          return false
                        })
                      },
                      disabledHours() {
                        const now = new Date()
                        return Array.from(Array(24).keys()).filter((h) => {
                          if (startTime != null && startTime.getHours() > h)
                            return false
                          if (endTime != null && endTime.getHours() < h)
                            return false
                          return h < now.getHours()
                        })
                      },
                    }
                  }}
                />
              </Form.Item>
              <Form.Item<Order>
                label="Đến"
                name={"to"}
                className="inline-block"
              >
                <TimePicker format={"HH:mm"} disabled={setting?.unitStyle} />
              </Form.Item>
            </Space>
          </Form.Item>
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
        </Col>
        <Col span={12}>
          <Details />
        </Col>
      </Row>
    </Form>
  )
}

type UnitSettingType = {
  unitStyle: boolean
  unitName: string
  minimumDuration: number
  openTime: number
  closeTime: number
  id: string
  duration: number
}

function useFieldUnitSetting(): [
  UnitSettingType | undefined,
  (id: string) => Promise<void>,
] {
  const connect = useConnect((s) => s.connect)
  const [data, setData] = useState<UnitSettingType>()
  const get = useCallback(
    (id: string) =>
      connect
        .get<UnitSettingType>("api/fieldUnitSetting/byFieldId", {
          params: { id },
        })
        .then((res) => {
          setData(res.data)
        }),
    [connect],
  )
  return [data, get]
}
