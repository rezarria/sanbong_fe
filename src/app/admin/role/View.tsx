import { Button, Col, Input, Modal, Row, Space } from "antd";
import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import ViewModel from "./ViewModel";
import { connect } from "@/lib/Axios";
import { AxiosError, HttpStatusCode } from "axios";
type StructType = {
  [key in keyof ViewModel]?: {
    title: string;
  };
};
type Ref = {
  show: (id: string) => void;
  hide: () => void;
};
type Props = {};

function View(props: Props, ref: ForwardedRef<Ref>) {
  const [isShowing, setIsShowing] = useState(false);
  const [info, setInfo] = useState<ViewModel>();

  useImperativeHandle(
    ref,
    () => ({
      show: (id: string) => {
        connect
          .get<ViewModel>("api/role", {
            params: {
              id,
            },
          })
          .then((res) => {
            if (res.status == HttpStatusCode.Ok) {
              setInfo(res.data);
              setIsShowing(true);
            }
          })
          .catch((err: AxiosError) => {
            console.error(err.message);
          });
      },
      hide: () => {
        setInfo(undefined);
        setIsShowing(false);
      },
    }),
    [],
  );

  return (
    <Modal
      open={isShowing}
      title="Thông tin về quyền"
      onCancel={() => setIsShowing(false)}
      footer={
        <Button title="đóng" type="primary" onClick={() => setIsShowing(false)}>
          ĐÓNG
        </Button>
      }
    >
      <Row>
        <Col span={24}>
          <Space direction="vertical" className="flex">
            <Row gutter={18} align={"middle"}>
              <Col span={3}>
                <label htmlFor="id">ID</label>
              </Col>
              <Col flex={"auto"}>
                <Input
                  title="Id"
                  id="id"
                  value={info?.id}
                  contentEditable={false}
                />
              </Col>
            </Row>
            <Row gutter={18} align={"middle"}>
              <Col span={3}>
                <label htmlFor="name">Tên</label>
              </Col>
              <Col flex={"auto"}>
                <Input id="name" title="Tên" value={info?.name} />
              </Col>
            </Row>
          </Space>
        </Col>
      </Row>
    </Modal>
  );
}

export { type Ref as ViewRef };
export default forwardRef(View);
