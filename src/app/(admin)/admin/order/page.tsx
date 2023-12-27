"use client"

import { Col, Form, Input, Row, TimePicker } from "antd"
import { Order } from "./type"
import FieldSelectInput from "@/components/manager/FieldSelectInput"
import useConnect from "@/store/useConnect"
import { useCallback, useState } from "react"
import CustomerSelectInput from "@/components/manager/CustomerSelectInput"

export default function Page() {
  const [setting, getSetting] = useFieldUnitSetting()
  return (
    <Row>
      <Col span={12}>
        <Form<Order> layout="vertical">
          <Form.Item<Order> label="sân">
            <FieldSelectInput
              onChange2={(id) => {
                if (id) getSetting(id)
              }}
            />
          </Form.Item>
          <Form.Item<Order> label="Khách hàng">
            <CustomerSelectInput />
          </Form.Item>

          <Form.Item>
            <Form.Item<Order> label="Từ">
              {setting?.unitStyle ? (
                <TimePicker format={"HH:mm"} />
              ) : (
                <TimePicker.RangePicker
                  format={"HH:mm"}
                  disabled={setting == null}
                  disabledTime={(d, t) => {
                    if (setting?.unitStyle && t == "end") {
                      return {
                        disabledHours: () => Array.from(Array(24).keys()),
                        disabledMinutes: () => Array.from(Array(60).keys()),
                      }
                    }
                    return {
                      disabledHours() {
                        const hour = new Date().getHours()
                        return Array.from(Array(24).keys()).filter(
                          (i) => i < hour,
                        )
                      },
                    }
                  }}
                />
              )}
            </Form.Item>
            {setting?.unitStyle && (
              <Form.Item label="Đến">
                <TimePicker format={"HH:mm"} disabled />
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item<Order> label={`Số ${setting?.unitName ?? "..."}`}>
            <Input
              type="number"
              disabled={setting == null || !setting.unitStyle}
            />
          </Form.Item>
        </Form>
      </Col>
      <Col span={12} />
    </Row>
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
