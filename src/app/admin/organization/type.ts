export type AddModel = {
  name: string
  phone?: string
  email?: string
  address?: string
  image?: string
}

export type EditModel2 = {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  image?: string
  lastModifiedDate: string
}

export type ViewModel = {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  image?: string
}

export type ListModel = {
  id: string
  name?: string
}
