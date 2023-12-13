"use client"

import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import { connect } from "@/lib/Axios"
import { HttpStatusCode } from "axios"
import { DatePicker, Form, FormItemProps, Input, Modal, Space } from "antd"
import * as jsonpatch from "fast-json-patch"
import dayjs from "dayjs"
import { EditAvatar } from "./EditAvatar"
import { ModalFooterRender } from "antd/es/modal/interface"

interface TrackerModel {
  lastModifiedDate: string
}

type Section<T extends TrackerModel> = {
  name?: Extract<keyof T, string>
  label?: string
  input?: ReactNode
  type?: string
  customGet?: FormItemProps<T>["getValueProps"]
  customGetFromEvent?: FormItemProps<T>["getValueFromEvent"]
}
type Ref = {
  show: (id: string) => void
  hide: () => void
}
type Props<T extends { id: string; lastModifiedDate: string }> = {
  onComplete?: () => void
  sections?: Section<T>[]
  name: string
  url: string
  children?: ReactNode
  button?: (id: string) => ReactNode
}

function Edit<T extends { id: string; lastModifiedDate: string }>(
  props: Props<T>,
  ref: ForwardedRef<Ref>,
) {
  const [isOpening, setIsOpening] = useState(false)
  const [data, setData] = useState<T>()
  const [form] = Form.useForm<T>()
  const fetch = useCallback(
    (id: string) =>
      connect
        .get([props.url, "beforeUpdate"].join("/"), { params: { id } })
        .then((res) => {
          if (res.status == HttpStatusCode.Ok) {
            setData(res.data)
          }
        }),
    [props.url],
  )
  const onFinish = useCallback(
    (newData: T) => {
      if (data != null) {
        const d = structuredClone(newData)

        Object.keys(d).forEach((key) => {
          d[key as keyof T] = data[key as keyof T]
        })

        const patch = jsonpatch.compare(d, newData)
        connect
          .patch(
            props.url,
            {
              id: data.id,
              patch,
              time: data.lastModifiedDate,
            },
            {
              headers: {
                "Content-Type": "application/json-patch+json",
              },
            },
          )
          .then((res) => {
            if (res.status == HttpStatusCode.Ok) {
              setIsOpening(false)
              props.onComplete?.()
            }
          })
      }
    },
    [data, props],
  )
  useImperativeHandle(
    ref,
    () => ({
      show: (id) => {
        fetch(id).then(() => {
          setIsOpening(true)
        })
      },
      hide: () => {},
    }),
    [fetch],
  )
  const selectType = useCallback((index: number, section: Section<T>) => {
    if (section.type == null)
      return (
        <Form.Item
          key={index}
          name={section.name as string}
          label={section.label}
          getValueProps={section.customGet}
          getValueFromEvent={section.customGetFromEvent}
        >
          <Input />
        </Form.Item>
      )
    switch (section.type) {
      case "datepicker":
        return (
          <Form.Item
            key={index}
            name={section.name as string}
            label={section.label}
            getValueProps={(i: string) => ({
              value: i === undefined ? undefined : dayjs(i),
            })}
          >
            <DatePicker className="!w-full" format="DD-MM-YYYY" />
          </Form.Item>
        )
      case "avatar":
        return (
          <Form.Item
            key={index}
            label={section.label}
            name={section.name as string}
            getValueProps={section.customGet}
            getValueFromEvent={section.customGetFromEvent}
          >
            <EditAvatar />
          </Form.Item>
        )
      default:
        return (
          <Form.Item
            key={index}
            name={section.name as string}
            label={section.label}
            getValueProps={section.customGet}
            getValueFromEvent={section.customGetFromEvent}
          >
            <Input
              contentEditable={true}
              type={section.type}
              name={section.name}
            />
          </Form.Item>
        )
    }
  }, [])
  useEffect(() => {
    if (data != null) {
      form.setFieldsValue(data as NonNullable<T>)
    }
    return () => {
      form.resetFields()
    }
  }, [data, form])
  const footer = useCallback<ModalFooterRender>(
    (o, e) => (
      <Space>
        {data && props.button?.(data.id)}
        {o}
      </Space>
    ),
    [data, props.button],
  )
  return (
    <Modal
      open={isOpening}
      onCancel={() => setIsOpening(false)}
      onOk={() => form.submit()}
      title={"Sửa thông tin " + props.name}
      footer={footer}
    >
      <Form
        autoComplete="false"
        name="edit"
        labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        form={form}
        initialValues={data}
      >
        <Form.Item name={"id"} key={"id"} hidden>
          <Input />
        </Form.Item>
        {props.sections?.map((section, index) =>
          data != null ? (
            <>
              {section.input ? (
                <Form.Item
                  key={index}
                  name={section.name as string}
                  label={section.label}
                  getValueProps={section.customGet}
                  getValueFromEvent={section.customGetFromEvent}
                >
                  {section.input}
                </Form.Item>
              ) : (
                selectType(index, section)
              )}
            </>
          ) : undefined,
        )}
        {props.children}
        <Form.Item hidden name={"lastModifiedDate"} key={"lastModifiedDate"}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export { type Ref as EditRef }
const ForwardedRefEdit = <
  T extends { id: string; lastModifiedDate: string },
>() => forwardRef(Edit<T>)
export default ForwardedRefEdit
