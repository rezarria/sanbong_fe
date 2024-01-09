export type ViewModel = {
  id: string
  paymentMethod: "MONEY" | "VNPAY" | "ETC"
  paymentStatus: "NONE" | "PENDING" | "DONE" | "ERROR" | "CANCEL"
  totalPrice: number
  description: string
  lastModifiedDate: number
  customer: {
    id: string
    name: string
    avatar: string
  }
  fieldHistory: {
    id: string
    unitsize: number
    from: number
    to: number
    field: {
      id: string
      name: string
      description: string
      active: boolean
      lastModifiedDate: number
      images: {
        id: string
        path: string
      }[]
    }
    staff: {
      id: string
      name: string
      avatar: string
    }
  }
  organization: {
    id: string
    name: string
    image: string
  }
  details: {
    id: string
    count: number
    lastModifiedDate: number
    product: {
      id: string
      name: string
      description: string
      lastModifiedDate: number
    }
    price: {
      id: string
      price: number
      description: string
    }
  }[]
}

export type EditModel = {
  id: string
  customerId: string
  fieldId: string
  from: number
  to: number
  unitSize: number
  details: {
    id: string
    consumerProductId: string
    priceId: string
    count: number
  }[]
  paymentMethod: "MONEY" | "VNPAY" | "ETC"
  paymentStatus: "NONE" | "PENDING" | "DONE" | "ERROR" | "CANCEL"
  lastModifiedDate: number
}
