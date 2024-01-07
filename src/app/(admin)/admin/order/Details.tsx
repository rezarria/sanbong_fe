import { Button, Form, Input, InputNumber, Space, Table, message } from "antd"
import ConsumerProductSelectInput from "./ConsumerProductSelectInput"

export default function Details() {
  const form = Form.useFormInstance()
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
                      <Form.Item noStyle>
                        <Form.Item
                          name={[v, "consumerProductId"]}
                          initialValue={null}
                        >
                          <ConsumerProductSelectInput
                            onChange2={(data) => {
                              form.setFieldValue(
                                ["details", v, "priceId"],
                                data?.priceId,
                              )
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          hidden
                          name={[v, "priceId"]}
                          initialValue={null}
                        >
                          <Input />
                        </Form.Item>
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
                      <Form.Item name={[v, "count"]} initialValue={0}>
                        <InputNumber />
                      </Form.Item>
                    ),
                  },
                  {
                    title: "Thao tác",
                    dataIndex: "action",
                    width: "100px",
                    rowScope: "row",
                    key: "consumerProductId",
                    render: (_v, _r, index) => (
                      <Button
                        danger
                        type="primary"
                        onClick={() => {
                          opt.remove(index)
                        }}
                      >
                        Xóa
                      </Button>
                    ),
                  },
                ]}
              />
              <Button
                onClick={() => {
                  opt.add({ consumerProductId: null, count: 0 })
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
