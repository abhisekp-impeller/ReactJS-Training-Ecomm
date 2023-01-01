import localforage from 'localforage'
import { validateProduct } from "../util/validateProduct";
import { ErrorProductNotFound, ProductErrors } from "../errors/product-errors";
import { Product, WithId } from "../types/Product";
import sift from "sift";
import { partition } from 'lodash/fp'
import { generateProductId } from "../util/productId";
import { faker } from "@faker-js/faker";
import { PRODUCTS_KEY } from "../constants/product";

localforage.config({
  name: "reactjs-training-ecomm",
  description: "ReactJS Training E-Commerce",
})

export const addProduct = async <P extends Pick<Product, 'id' | 'availability' | 'price'>>(product: P): Promise<P> => {
  if (!product.id) {
    product.id = generateProductId()
  }

  const errors = validateProduct<P>(product)
  if (errors != null) {
    throw new ProductErrors(errors)
  }
  const products = await getProducts<P>()

  if (products.find(p => p.id === product.id)) {
    return addProduct(product)
  }

  const newProducts = [...products, product]
  await localforage.setItem(PRODUCTS_KEY, newProducts)
  await localforage.setItem(product.id, product)
  return product
}

export const getProducts = async <P>(query?: any): Promise<P[]> => {
  let products = await localforage.getItem<P[]>(PRODUCTS_KEY) || []
  if (query) {
    products = products.filter(sift<P>(query))
  }
  return products
}

export const getProductById = async <P extends WithId>(id: string): Promise<P | null> => {
  return await localforage.getItem(id)
}

export const updateProductById = async <P extends WithId>(id: string, productPartialUpdateData: any): Promise<P> => {
  const products = await getProducts<P>()
  const index = products.findIndex(p => p.id === id)
  if (index === -1) {
    throw new ErrorProductNotFound(id)
  }
  const product = Object.assign<P, Partial<P>>(products[index], productPartialUpdateData)
  await localforage.setItem<P[]>(PRODUCTS_KEY, products)
  await localforage.setItem<P>(id, product)
  return product
}

export const deleteProduct = async <P extends WithId>(query: any): Promise<P[]> => {
  const products = await getProducts<P>()
  const [productsToDelete, productsToKeep] = partition<P>(sift<P>(query))(products)
  await localforage.setItem(PRODUCTS_KEY, productsToKeep)
  for await (const p of productsToDelete) {
    await localforage.removeItem(p.id)
  }
  return productsToDelete
}

export const softDeleteProductById = async <P extends WithId>(id: string): Promise<P> => {
  return await updateProductById<P>(id, { deleted: true })
}

export const createProduct = (): Product => ({
  name: faker.commerce.productName(),
  price: Number(faker.commerce.price()),
  description: faker.commerce.productDescription(),
  image: faker.image.food(300, 300, true),
  id: generateProductId(),
  availability: faker.datatype.number(100),
  deleted: false,
})

export const seedProducts = async (seedSize: number): Promise<Product[]> => {
  let products: Product[] = []
  for await (const product of Array.from({ length: seedSize }, createProduct)) {
    try {
      await addProduct(product)
      products.push(product)
    } catch (e) {
      console.error(e)
    }
  }
  return products
}