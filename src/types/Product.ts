export interface WithId {
  id: string;
}

export interface WithAvailability {
  availability: number;

}

export interface WithPrice {
  price: number;
}

export interface WithProduct {
  name: string;
  description?: string;
  image?: string;
}

export type Product = WithId & WithAvailability & WithPrice & WithProduct;