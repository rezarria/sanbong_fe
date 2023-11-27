"use client";

import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { connect } from "@/lib/Axios";
import { HttpStatusCode } from "axios";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  FormInstance,
  Image,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
} from "antd";
import * as jsonpatch from "fast-json-patch";
import dayjs from "dayjs";
import UserAvatar from "@/app/admin/user/UserAvatar";
import { FormContext } from "antd/lib/form/context";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

interface TrackerModel {
  lastModifiedDate: string;
}

type Section<T extends TrackerModel> = {
  name?: Extract<keyof T, string>;
  label?: string;
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
  children?: ReactNode;
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
  const selectType = useCallback(
    (index: number, section: Section<T>, form: FormInstance) => {
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
          return (
            <Form.Item
              key={index}
              label={section.label}
              name={section.name as string}
            >
              <EditAvatar />
            </Form.Item>
          );
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
    },
    [],
  );
  useEffect(() => {
    if (data != null) {
      form.setFieldsValue(data as NonNullable<T>);
    }
    return () => {
      form.resetFields();
    };
  }, [data, form]);
  return (
    <Modal
      open={isOpening}
      onCancel={() => setIsOpening(false)}
      onOk={() => form.submit()}
      title={"Sửa thông tin " + props.name}
    >
      <Form
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
          data != null
            ? section.input?.(index, data) ?? selectType(index, section, form)
            : undefined,
        )}
        {props.children}
        <Form.Item hidden name={"lastModifiedDate"} key={"lastModifiedDate"}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function EditAvatar(
  props: Readonly<{ value?: string; onChange?: (value: string) => void }>,
) {
  const [url, setUrl] = useState(connect.defaults.baseURL! + props.value);
  const [lock, setLock] = useState(false);
  const [preview, setPreview] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  return (
    <>
      <Card className="w-fit overflow-hidden" bodyStyle={{ padding: 0 }}>
        <Image
          width={"100%"}
          src={url}
          className="aspect-square object-cover"
          preview={
            preview
              ? {
                  visible: true,
                  onVisibleChange: (e) => {
                    if (!e) setPreview(false);
                  },
                }
              : false
          }
          onMouseEnter={() => {
            if (!lock) card.current?.classList.remove("hidden");
          }}
        />
        <Card
          ref={card}
          className="absolute w-full h-full hidden bg-black/50 z-10 top-0 duration-700"
          bodyStyle={{ width: "100%", height: "100%" }}
          onMouseLeave={() => {
            if (!lock) card.current?.classList.add("hidden");
          }}
        >
          <Row className="w-full h-full" justify={"center"} align={"middle"}>
            <Col>
              <Space>
                <Popconfirm
                  title={"bạn có chắc xoá ảnh này?"}
                  onConfirm={() => {
                    card.current?.classList.add("hidden");
                    setLock(true);
                    setUrl("#");
                  }}
                  onOpenChange={(e) => {
                    if (!e) setLock(false);
                  }}
                  onCancel={() => {
                    setLock(false);
                  }}
                >
                  <Button
                    type={"primary"}
                    danger
                    onClick={() => {
                      setLock(true);
                    }}
                  >
                    <DeleteOutlined /> xoá ảnh
                  </Button>
                </Popconfirm>
                <Button
                  type={"primary"}
                  onClick={() => {
                    setPreview(true);
                  }}
                >
                  <EyeOutlined /> xem ảnh
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </Card>
      <Button />
    </>
  );
}

export { type Ref as EditRef };
const ForwardedRefEdit = <
  T extends { id: string; lastModifiedDate: string },
>() => forwardRef(Edit<T>);
export default ForwardedRefEdit;
