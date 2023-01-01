import { Price, Quantity } from "./types";

export interface CartItem<P> {
  id: string;
  product: P;
  quantity: Quantity;
  price: Price;
}

export interface Cart<P> {
  id: string;
  items: CartItem<P>[];
  quantity: Quantity;
  price: Price;
}