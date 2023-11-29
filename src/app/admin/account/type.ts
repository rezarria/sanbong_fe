export type AddModel = {
  username: string;
  password: string;
  password2: string;
};

export type EditModel = {
  id: string;
  username: string;
  lastModifiedDate: string;
};

export type ViewModel = {
  id: string;
  username: string;
};

export type ListModel = {
  id: string;
  username: string;
};
