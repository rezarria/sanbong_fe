export type EditModel = {
  id: string
  name: string
  images: string[]
  description?: string
  price?: number
  lastModifiedDate: string
}

export type ViewModel = {
  id: string
  name: string
  images: string[]
  description: string
  price: number
}

export type AddType = {
  name: string
  images: string[]
  description: string
  price: number
}

export type ListType = {
  id: string
  name: string
  images: string
}
