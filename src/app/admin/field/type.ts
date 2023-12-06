export type EditModel = {
  id: string
  name: string
  picture: string
  description: string
  price: number
  lastModifiedDate: string
}

export type ViewModel = {
  id: string
  name: string
  picture: string
  description: string
  price: number
}

export type AddType = {
  name: string
  picture: string
  description: string
  price: number
  images: string[]
}

export type ListType = {
  id: string
  name: string
  picture: string
}
