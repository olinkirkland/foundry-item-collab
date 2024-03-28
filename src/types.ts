export type User = {
  _id: string;
  name: string;
  isGM: boolean;
};

export type Item = {
  id: string;
  owner: string;
  name: string;
  type: string;
  level: number;
  description: string;
  price: number;
  quantity: number;
  bulk: number;
  flaggedForSale: boolean;
  flaggedForPersonal: boolean;
};
