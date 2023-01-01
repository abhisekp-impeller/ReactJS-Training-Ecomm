import { WithAvailability, WithId, WithPrice } from "../types/Product";
import localforage from "localforage";
import produce from 'immer';
import { Cart, CartItem } from "../types/Cart";
import { ErrorProductNotAvailable } from "../errors/product-errors";
import { generateCartId } from "../util/cartId";
import { CART_KEY } from "../constants/cart";
import { updateProductById } from "./product";
import { Price, Quantity } from "../types/types";

export const checkAvailability = async <P extends WithAvailability & WithId>(product: P, {
  quantity,
  isThrow = true
}: { quantity: number, isThrow?: boolean }): Promise<number> => {
  if (product.availability - quantity < 0) {
    if (isThrow) throw new ErrorProductNotAvailable(product.id)
  }
  return product.availability
}

/**
 * addToCart adds a product to the cart
 * @param product
 * @param options { quantity: number }
 * @param options.quantity quantity of the product to add to the cart
 * @throws ErrorProductNotAvailable
 * @throws ErrorProductNotFound
 * @returns Cart<P>
 */
export const addToCart = async <P extends WithId & WithAvailability & WithPrice>(product: P, { quantity = 1 }) => {
  if (quantity <= 0) {
    return await deleteFromCart(product);
  }

  await checkAvailability<P>(product, { quantity })

  const cart = await getCart<P, Cart<P>>();

  const newCart = produce(cart, newCart => {
    let cartItem = newCart.items.find(item => item.product.id === product.id)
    if (!cartItem) {
      // @ts-ignore
      cartItem = createCartItem<P>(product, { quantity })

      // Check ID collision. If there is a collision, generate a new ID
      const getExistingCartItemWithId = () => newCart.items.find(item => item.id === cartItem!.id);
      while (getExistingCartItemWithId()) {
        cartItem!.id = generateCartId();
      }

      // @ts-ignore
      newCart.items.push(cartItem)
    } else {
      cartItem!.quantity += quantity
    }

    [newCart.price, newCart.quantity] = calculateCartItemsPriceQuantity(newCart.items)
  })

  await updateProductById(product.id, { availability: product.availability - 1 })

  await localforage.setItem<Cart<P>>(CART_KEY, newCart)

  return newCart;
}

export const calculateCartItemsPriceQuantity = <P extends WithPrice>(cartItems: CartItem<P>[]): [Price, Quantity] => {
  return cartItems.reduce(([price, quantity], item) => {
    return [price + item.price * item.quantity, quantity + item.quantity]
  }, [0, 0])
}

export const getCart = async <P, C extends Cart<P>>() => {
  return await localforage.getItem<C>(CART_KEY) ?? await createCart<P, C>()
}

export const createCart = async <P, C extends Cart<P>>(): Promise<Cart<P>> => {
  // @ts-ignore
  return await localforage.setItem<C>(CART_KEY, {
    id: generateCartId(),
    items: [] as CartItem<P>[],
    price: 0,
    quantity: 0
  })
}

export const createCartItem = <P extends WithPrice>(product: P, { quantity = 0 }: { quantity?: number } = {}): CartItem<P> => {
  if (quantity < 0) {
    quantity = 0
  }

  return {
    id: generateCartId(),
    product,
    quantity,
    price: product.price * quantity,
  }
}

export const deleteFromCart = async <P extends WithId & WithPrice>(product: P) => {
  const cart = await getCart<P, Cart<P>>()
  const newCart = produce(cart, newCart => {
    const index = newCart.items.findIndex(item => item.product.id === product.id)
    if (index !== -1) {
      newCart.items.splice(index, 1)
    }

    // @ts-ignore
    [newCart.price, newCart.quantity] = calculateCartItemsPriceQuantity<P>(newCart.items)
  });

  await localforage.setItem<Cart<P>>(CART_KEY, newCart)
  return newCart
}