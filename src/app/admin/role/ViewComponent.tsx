import { Button, Col, Input, Modal, Row, Space } from "antd";
import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { connect } from "@/lib/Axios";
import { AxiosError, HttpStatusCode } from "axios";
type Section<T> = {
  name: Extract<keyof T, string>;
  title: string;
  label: string;
  id: string | Extract<keyof T, string>;
};
type Ref = {
  show: (id: string) => void;
  hide: () => void;
};
type Props<T> = {
  url: string;
  modalTitle: string;
  sections?: Section<T>[];
  children?: ReactNode;
};

function View<T extends { id: string }>(
  props: Props<T>,
  ref: ForwardedRef<Ref>,
) {
  const [isShowing, setIsShowing] = useState(false);
  const [info, setInfo] = useState<T>();
  const data: Section<T>[] = useMemo(() => {
    const arr: Section<T>[] = [
      {
        title: "ID",
        id: "id",
        label: "Id",
        name: "id" as Extract<keyof T, string>,
      },
    ];
    if (props.sections != null && props.sections.length != 0) {
      return arr.concat(props.sections);
    } else return arr;
  }, [props.sections]);
  useImperativeHandle(
    ref,
    () => ({
      show: (id: string) => {
        connect
          .get<T>(props.url, {
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
    [props.url],
  );

  return (
    <Modal
      open={isShowing}
      title={props.modalTitle}
      onCancel={() => setIsShowing(false)}
      footer={
        <Button title="đóng" type="primary" onClick={() => setIsShowing(false)}>
          ĐÓNG
        </Button>
      }
    >
      {info && (
        <Row>
          <Col span={24}>
            <Space direction="vertical" className="flex">
              {data.map((d) => (
                <Row key={d.name as string} gutter={18} align={"middle"}>
                  <Col span={3}>
                    <label htmlFor={d.id}>{d.label}</label>
                  </Col>
                  <Col flex={"auto"}>
                    <Input
                      title={d.title}
                      id={d.id}
                      value={info[d.name] as string | number | undefined}
                      contentEditable={false}
                    />
                  </Col>
                </Row>
              ))}
              {props.children}
            </Space>
          </Col>
        </Row>
      )}
    </Modal>
  );
}

export { type Ref as ViewRef };
const ForwardedRefView = <T extends { id: string }>() => forwardRef(View<T>);
export default ForwardedRefView;
