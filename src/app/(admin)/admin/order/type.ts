import { Dayjs } from "dayjs"

export type Order = {
  fieldId: string
  customerId: string
  from?: Dayjs
  to?: Dayjs
  unit: number
  description: string
  details?: {
    consumerProductId?: string
    count: number
  }[]
}
