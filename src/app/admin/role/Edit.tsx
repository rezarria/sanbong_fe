import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { connect } from "@/lib/Axios";
import { HttpStatusCode } from "axios";
import EditModel from "./EditModel";
import { Form, Input, Modal } from "antd";
import * as jsonpatch from "fast-json-patch";

type Ref = {
  show: (id: string) => void;
  hide: () => void;
};
type Props = {
  onComplete?: () => void;
};

function Edit(props: Props, ref: ForwardedRef<Ref>) {
  const [isOpening, setIsOpening] = useState(false);
  const [data, setData] = useState<EditModel>();
  const [form] = Form.useForm<EditModel>();
  const fetch = useCallback(
    (id: string) =>
      connect.get("api/role", { params: { id } }).then((res) => {
        if (res.status == HttpStatusCode.Ok) {
          setData(res.data);
          form.setFieldsValue(res.data);
        }
      }),
    [],
  );
  const onFinish = useCallback(
    (newData: EditModel) => {
      if (data != null) {
        const patch = jsonpatch.compare(data, newData);
        connect
          .patch("api/role", {
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

  return (
    <Modal
      open={isOpening}
      onCancel={() => setIsOpening(false)}
      title={"Sửa thông tin quyền"}
    >
      <Form
        name="basic"
        autoComplete="on"
        labelAlign="left"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item name={"id"} key={"id"}>
          <Input value={data?.id} />
        </Form.Item>
        <Form.Item<EditModel> label={"Tên"} name={"name"} key={"name"}>
          <Input />
        </Form.Item>
        <Form.Item<EditModel>
          name={"lastModifiedDate"}
          key={"lastModifiedDate"}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export { type Ref as EditRef };
export default forwardRef(Edit);
