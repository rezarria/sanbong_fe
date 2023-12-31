import { Form, Input, Segmented, Space } from "antd"
import Image from "next/image"

export default function PaymentMethod() {
  return (
    <>
      <Form.Item label="Phương thức thanh toán">
        <Segmented
          options={[
            {
              label: (
                <Space direction="vertical">
                  <div className="max-h-[60px] aspect-square flex justify-center items-center">
                    <Image
                      className="!relative"
                      alt="money icon"
                      src="/money.svg"
                      fill
                    />
                  </div>
                  <p>Tiền mặt</p>
                </Space>
              ),
              value: 1,
            },
            {
              label: (
                <Space direction="vertical">
                  <div className="max-h-[60px] aspect-square flex justify-center items-center">
                    <Image
                      className="!relative"
                      alt="vnpay icon"
                      src="/vnpay.svg"
                      fill
                    />
                  </div>
                  <p>VNPAY</p>
                </Space>
              ),
              value: 2,
            },
          ]}
        />
      </Form.Item>
    </>
  )
}
