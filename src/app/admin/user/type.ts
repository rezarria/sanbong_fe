export type EditModel = {
  id: string;
  name: string;
  dob: string;
  avatar: string;
  lastModifiedDate: string;
};

export type ViewModel = {
  id: string;
  name?: string;
  dob: string;
  avatar: string;
};

export type AddModel = {
  name: string;
  dob: string;
  avatar: string;
};

export type ListModel = {
  id: string;
  name: string;
};
