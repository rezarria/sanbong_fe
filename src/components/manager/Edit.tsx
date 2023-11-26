"use client";

import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { connect } from "@/lib/Axios";
import { HttpStatusCode } from "axios";
import {
  Col,
  DatePicker,
  Form,
  FormInstance,
  Image,
  Input,
  Modal,
  Row,
} from "antd";
import * as jsonpatch from "fast-json-patch";
import dayjs from "dayjs";
import UserAvatar from "@/app/admin/user/UserAvatar";
import { FormContext, FormContextProps } from "antd/lib/form/context";

interface TrackerModel {
  lastModifiedDate: string;
}

type Section<T extends TrackerModel> = {
  name: Extract<keyof T, string>;
  label: string;
  input?: (index: number, data: T) => ReactNode;
  type?: string;
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
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item name={"id"} key={"id"} hidden>
          <Input />
        </Form.Item>
        {props.sections?.map((section, index) =>
          data != null
            ? section.input?.(index, data) ?? selectType(index, section, form)
            : undefined,
        )}
        <Form.Item hidden name={"lastModifiedDate"} key={"lastModifiedDate"}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function EditAvatar<T extends TrackerModel>(
  props: Readonly<{ section: Section<T>; form: FormInstance }>,
) {
  const formProps = useContext(FormContext);
  console.log(props.form?.getFieldValue("avatar"));
  return (
    <Row>
      <Col span={formProps.labelCol?.span}>
        <label>{props.section.label}:</label>
      </Col>
      <Col span={formProps.wrapperCol?.span}>
        <UserAvatar
          url="api/file"
          initalUrl={props.form.getFieldValue("avatar")}
        />
      </Col>
    </Row>
  );
}

function selectType<T extends TrackerModel>(
  index: number,
  section: Section<T>,
  form: FormInstance,
) {
  if (section.type == null)
    return (
      <Form.Item
        key={index}
        name={section.name as string}
        label={section.label}
      >
        <Input contentEditable={true} name={section.name} />
      </Form.Item>
    );
  switch (section.type) {
    case "datepicker":
      return (
        <Form.Item
          key={index}
          name={section.name as string}
          label={section.label}
          getValueProps={(i) => ({
            value: i === undefined ? undefined : dayjs(i),
          })}
        >
          <DatePicker className="!w-full" format="DD-MM-YYYY" />
        </Form.Item>
      );
    case "avatar":
      return <EditAvatar key={index} section={section} form={form} />;
    default:
      return (
        <Form.Item
          key={index}
          name={section.name as string}
          label={section.label}
        >
          <Input
            contentEditable={true}
            type={section.type}
            name={section.name}
          />
        </Form.Item>
      );
  }
}

export { type Ref as EditRef };
const ForwardedRefEdit = <
  T extends { id: string; lastModifiedDate: string },
>() => forwardRef(Edit<T>);
export default ForwardedRefEdit;
