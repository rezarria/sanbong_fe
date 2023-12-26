export type AddModel = {
  username: string
  password: string
  password2: string
  user: string
  roles: string[]
}

export type EditModel = {
  id: string
  username: string
  user: string
  roles: string[]
  lastModifiedDate: string
}

export type EditModel2 = {
  id: string
  username: string
  userId?: string
  roleIds: string[]
  lastModifiedDate: string
}

export type ViewModel = {
  id: string
  username: string
  roleIds: string[]
  userId?: string
}

export type ListModel = {
  id: string
  username: string
}

export type ChangePasswordModel = {
  id: string
  oldPassword: string
  newPassword: string
  newPassword2?: string
}
