export type Address = {
  id: string;

  name: string;
  phone: string;

  house: string;
  street: string;
  area: string;
  village: string;

  city: string;
  state: string;
  pincode: string;

  landmark?: string;

  addressType: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
};