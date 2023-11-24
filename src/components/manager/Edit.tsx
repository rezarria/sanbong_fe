"use client";

import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { connect } from "@/lib/Axios";
import { HttpStatusCode } from "axios";
import { Form, Input, Modal } from "antd";
import * as jsonpatch from "fast-json-patch";
type Section<T extends { id: string; lastModifiedDate: string }> = {
  id: string;
  name: Extract<keyof T, string>;
  label: string;
};
type Ref = {
  show: (id: string) => void;
  hide: () => void;
};
type Props<T extends { id: string; lastModifiedDate: string }> = {
  onComplete?: () => void;
  sections?: Section<T>[];
  name: string;
  url: string;
};

function Edit<T extends { id: string; lastModifiedDate: string }>(
  props: Props<T>,
  ref: ForwardedRef<Ref>,
) {
  const [isOpening, setIsOpening] = useState(false);
  const [data, setData] = useState<T>();
  const [form] = Form.useForm<T>();
  const fetch = useCallback(
    (id: string) =>
      connect.get(props.url, { params: { id } }).then((res) => {
        if (res.status == HttpStatusCode.Ok) {
          setData(res.data);
        }
      }),
    [props.url],
  );
  const onFinish = useCallback(
    (newData: T) => {
      if (data != null) {
        const d = structuredClone(newData);

        Object.keys(d).forEach((key) => {
          d[key as keyof T] = data[key as keyof T];
        });

        const patch = jsonpatch.compare(d, newData);
        connect
          .patch(props.url, {
            id: data.id,
            patch,
            time: data.lastModifiedDate,
          })
          .then((res) => {
            if (res.status == HttpStatusCode.Ok) {
              setIsOpening(false);
              props.onComplete?.();
            }
          });
      }
    },
    [data, props],
  );
  useImperativeHandle(
    ref,
    () => ({
      show: (id) => {
        fetch(id).then(() => {
          setIsOpening(true);
        });
      },
      hide: () => {},
    }),
    [fetch],
  );
  useEffect(() => {
    if (data != null) form.setFieldsValue(data as NonNullable<T>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <Modal
      open={isOpening}
      onCancel={() => setIsOpening(false)}
      onOk={() => form.submit()}
      title={"Sửa thông tin " + props.name}
    >
      <Form
        name="basic"
        autoComplete="on"
        labelAlign="left"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item name={"id"} key={"id"} hidden>
          <Input value={data?.id} />
        </Form.Item>
        {props.sections?.map((i) => (
          <Form.Item
            key={i.id}
            id={i.id}
            name={i.name as string}
            label={i.label}
          >
            <Input
              value={
                (data?.[i.name as keyof T] as string | number) ?? undefined
              }
            />
          </Form.Item>
        ))}
        <Form.Item hidden name={"lastModifiedDate"} key={"lastModifiedDate"}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export { type Ref as EditRef };
const ForwardedRefEdit = <
  T extends { id: string; lastModifiedDate: string },
>() => forwardRef(Edit<T>);
export default ForwardedRefEdit;
