import { Price, Quantity } from "./types";

export interface WithId {
  id: string;
}

export interface WithAvailability {
  availability: Quantity;
}

export interface WithPrice {
  price: Price;
}

export interface WithDeleted {
  deleted: boolean;
}

export interface WithProduct {
  name: string;
  description?: string;
  image?: string;
}

export type Product = WithId &
  WithAvailability &
  WithPrice &
  Partial<WithDeleted> &
  WithProduct;
