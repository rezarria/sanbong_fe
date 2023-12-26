import {
  DatePicker,
  Form,
  Input,
  Modal,
  Switch,
  TimePicker,
  TimePickerProps,
} from "antd"
import {
  Dispatch,
  ForwardedRef,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import useConnect from "@/store/useConnect"
import { HttpStatusCode } from "axios"
import { RangePickerProps } from "antd/es/date-picker"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

const { RangePicker } = DatePicker
export type EditTimeProps = {}
export type EditTimeRef = {
  show: (id: string) => void
  hide: () => void
}

const EditTime = forwardRef(_EditTime)

export default EditTime

function _EditTime(
  props: Readonly<EditTimeProps>,
  ref: ForwardedRef<EditTimeRef>,
) {
  const [ok, setOk] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [fieldId, setFieldId] = useState<string>()
  const field = useField(fieldId)
  const [setting, setSetting] = useCurrentFieldSetting(fieldId, clickCount)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm<FieldForm>()
  const [useUnit, setUseUnit] = useState(false)
  const connect = useConnect((s) => s.connect)
  const finishHandle = useCallback(
    async (values: FieldForm) => {
      const start = values.openCloseTime?.[0]
      const end = values.openCloseTime?.[1]
      const data = {
        unitName: values.unitName,
        unitStyle: values.unitStyle,
        duration:
          values.duration != null
            ? values.duration.hour() * 60 + values.duration.minute()
            : null,
        openTime: start != null ? start.hour() * 60 + start.minute() : null,
        closeTime: end != null ? end.hour() * 60 + end.minute() : null,
        fieldId,
      } as FieldSetting

      const res = await connect.post("api/fieldUnitSetting", data)

      if (res.status === HttpStatusCode.Ok) {
        setOpen(false)
      }
    },
    [connect, fieldId],
  )
  const okHandle = useCallback(() => {
    form.submit()
  }, [form])
  const cancelHandle = useCallback(() => {
    setOpen(false)
    setSetting(undefined)
    form.setFieldsValue({
      duration: null,
      openCloseTime: [null, null],
      unitName: "",
      unitStyle: false,
    })
    setOk(false)
  }, [form, setSetting])
  useImperativeHandle(
    ref,
    () => ({
      show: (id) => {
        setClickCount((i) => i + 1)
        setFieldId(id)
        setOpen(true)
      },
      hide: () => {
        setOpen(false)
      },
    }),
    [],
  )
  useEffect(() => {
    if (setting != null) {
      const today = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      today.setMilliseconds(0)
      today.setHours(0)
      let duration = dayjs("00:00:00", "HH:mm:ss")
      duration = duration.add(setting.duration, "minutes")

      const startTime = dayjs(new Date(today).setMinutes(setting.openTime))
      const endTime = dayjs(new Date(today).setMinutes(setting.closeTime))
      setUseUnit(setting.unitStyle)
      form.setFieldsValue({
        unitName: setting.unitName,
        unitStyle: setting.unitStyle,
        duration,
        openCloseTime: [startTime, endTime],
      })
    }
  }, [form, setting, clickCount])
  return (
    <Modal
      okButtonProps={{ disabled: !ok }}
      open={open}
      title={`${field?.name}`}
      onOk={okHandle}
      onCancel={cancelHandle}
    >
      <Form<FieldForm>
        form={form}
        labelAlign="right"
        labelCol={{ span: 8 }}
        colon={true}
        onFinish={finishHandle}
        onFieldsChange={() => {
          setOk(true)
        }}
      >
        <Form.Item<FieldForm>
          name={["openCloseTime"]}
          label="Giờ mở cửa / đóng cửa"
        >
          <RangePicker className="w-full" format={"HH:mm"} picker="time" />
        </Form.Item>
        <Form.Item<FieldForm> name={"unitStyle"} label={"Sử dụng đơn vị"}>
          <Switch
            onChange={(v) => {
              setUseUnit(v)
            }}
          />
        </Form.Item>
        <Form.Item<FieldForm> name={"unitName"} label={"Tên đơn vị"}>
          <Input disabled={!useUnit} />
        </Form.Item>
        <Form.Item<FieldForm> name={"duration"} label={"Thời gian 1 đơn vị"}>
          <TimePicker
            showNow={false}
            showSecond={false}
            format={"HH:mm"}
            disabled={!useUnit}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

type Field = { id: string; name: string }
type FieldSetting = {
  id: string
  unitName: string
  unitStyle: boolean
  closeTime: number
  duration: number
  openTime: number
  fieldId: string
}

type FieldForm = {
  openCloseTime: RangePickerProps["value"]
  duration: TimePickerProps["value"]
} & Omit<FieldSetting, "openTime" | "closeTime" | "duration">

function useCurrentFieldSetting(
  id?: string,
  clickCount?: number,
): [
  FieldSetting | undefined,
  Dispatch<SetStateAction<FieldSetting | undefined>>,
] {
  const connect = useConnect((s) => s.connect)
  const [setting, setSetting] = useState<FieldSetting>()
  useEffect(() => {
    if (id != null) {
      connect
        .get<FieldSetting>("api/fieldUnitSetting/byFieldId", {
          params: { id },
        })
        .then((res) => {
          if (res.status === HttpStatusCode.Ok) {
            setSetting(res.data)
          }
        })
        .catch(() => {})
    }
  }, [id, connect, clickCount])
  return [setting, setSetting]
}

function useField(id?: string) {
  const connect = useConnect((s) => s.connect)
  const [field, setField] = useState<Field>()
  useEffect(() => {
    if (id != null) {
      connect.get<Field>("api/field", { params: { id } }).then((res) => {
        if (res.status === HttpStatusCode.Ok) {
          setField(res.data)
        }
      })
    }
  }, [connect, id])
  return field
}
