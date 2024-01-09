import { Form, Space, TimePicker } from "antd"
import { Order } from "./orderType"
import useFieldUnitSetting from "./useFieldUnitSetting"

type Props = {
  startTime?: Date
  endTime?: Date
  setting: ReturnType<typeof useFieldUnitSetting>[0]
}

export default function FromToTimeInput(props: Readonly<Props>) {
  return (
    <Form.Item>
      <Space>
        <Form.Item<Order> label="Từ" name={"from"} className="inline-block">
          <TimePicker
            format={"HH:mm"}
            disabledTime={(d) => {
              return {
                disabledMinutes(hour) {
                  return Array.from(Array(60).keys()).filter((m) => {
                    if (hour == props.endTime?.getHours()) {
                      return (
                        m >
                        props.endTime.getMinutes() -
                          (props.setting ? props.setting.minimumDuration : 0)
                      )
                    }
                    if (hour == d.hour()) return m < d.minute()
                    return false
                  })
                },
                disabledHours() {
                  const now = new Date()
                  return Array.from(Array(24).keys()).filter((h) => {
                    if (
                      props.startTime != null &&
                      props.startTime.getHours() > h
                    )
                      return true
                    if (props.endTime != null && props.endTime.getHours() < h)
                      return true
                    return h < now.getHours()
                  })
                },
              }
            }}
          />
        </Form.Item>
        <Form.Item<Order> label="Đến" name={"to"} className="inline-block">
          <TimePicker
            format={"HH:mm"}
            disabled={props.setting?.unitStyle}
            disabledTime={(d) => {
              return {
                disabledMinutes(hour) {
                  return Array.from(Array(60).keys()).filter((m) => {
                    if (hour == props.endTime?.getHours()) {
                      return m > props.endTime.getMinutes()
                    }
                    if (hour == d.hour()) return m < d.minute()
                    return false
                  })
                },
                disabledHours() {
                  const now = new Date()
                  return Array.from(Array(24).keys()).filter((h) => {
                    if (
                      props.startTime != null &&
                      props.startTime.getHours() > h
                    )
                      return true
                    if (props.endTime != null && props.endTime.getHours() < h)
                      return true
                    return h < now.getHours()
                  })
                },
              }
            }}
          />
        </Form.Item>
      </Space>
    </Form.Item>
  )
}
