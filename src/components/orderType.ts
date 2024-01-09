import { Dayjs } from "dayjs"

export type Order = {
  fieldId?: string
  fieldUnitSettingId?: string
  priceId: string
  customerId: string
  from?: Dayjs
  to?: Dayjs
  unit: number
  description: string
  paymentMethod: PaymentMethodType
  details?: (
    | {
        consumerProductId?: string
        count: number
      }
    | undefined
  )[]
}

export type Schedule = {
  id: string
  unitSize: number
  from: number
  to: number
}

export type PaymentMethodType = "MONEY" | "VNPAY"
