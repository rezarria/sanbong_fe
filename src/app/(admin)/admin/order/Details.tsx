import { Button, Divider, Form, Input, Select, Space, Table } from "antd"
import ConsumerProductSelectInput from "./ConsumerProductSelectInput"

export default function Details() {
  return (
    <Form.Item>
      <Form.List name={"details"}>
        {(subs, opt) => (
          <Space direction="vertical" size={0}>
            <Button
              onClick={() => {
                opt.add()
              }}
            >
              Thêm
            </Button>
            <Space direction="vertical" className="w-full">
              <Table
                scroll={{ y: 400 }}
                dataSource={subs}
                columns={[
                  {
                    title: "Sản phẩm",
                    dataIndex: "name",
                    key: "consumerProductId",
                    render: (v) => (
                      <Form.Item name={[v, "consumerProductId"]}>
                        <ConsumerProductSelectInput />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "Số lượng",
                    dataIndex: "name",
                    key: "count",
                    rowSpan: 6,
                    width: "20%",
                    render: (v) => (
                      <Form.Item name={[v, "count"]}>
                        <Input type="number" />
                      </Form.Item>
                    ),
                  },
                ]}
              />
              <Button
                onClick={() => {
                  opt.add()
                }}
              >
                Thêm
              </Button>
            </Space>
          </Space>
        )}
      </Form.List>
    </Form.Item>
  )
}
