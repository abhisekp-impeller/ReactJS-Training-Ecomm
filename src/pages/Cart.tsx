import { LoaderFunction, useLoaderData } from "react-router-dom";
import { getCart } from "../datasource/cart";
import { Product } from "../types/Product";
import { Cart } from "../types/Cart";

export const loader: LoaderFunction = async () => {
  const cart = await getCart();
  return { cart }
}

export const CartPage = () => {
  const { cart } = useLoaderData() as { cart: Cart<Product> };
  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            {item.product.name} - {item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};