import localforage from 'localforage'
import { validateProduct } from "../util/validateProduct";
import { ErrorProductNotFound, ProductErrors } from "../errors/product-errors";
import { Product } from "../types/Product";
import sift from "sift";
import { customAlphabet } from "nanoid/non-secure";
import { partition } from 'lodash/fp'

const nanoid = customAlphabet('1234567890abcdef', 10)

localforage.config({
  name: "reactjs-training-ecomm",
  description: "ReactJS Training E-Commerce",
})

export const addProduct = async <P extends Pick<Product, 'id' | 'availability' | 'price'>>(product: P): Promise<P> => {
  if (!product.id) {
    product.id = nanoid()
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
  await localforage.setItem('products', newProducts)
  await localforage.setItem(product.id, product)
  return product
}

export const getProducts = async <P>(query?: any): Promise<P[]> => {
  let products = await localforage.getItem<P[]>('products') || []
  if (query) {
    products = products.filter(sift<P>(query))
  }
  return products
}

export const getProductById = async <P extends Product>(id: string): Promise<P | null> => {
  return await localforage.getItem(id)
}

export const updateProductById = async <P extends Product>(id: string, productData: P): Promise<P> => {
  const errors = validateProduct<P>(productData)
  if (errors != null) {
    throw new ProductErrors(errors)
  }
  const products = await getProducts<P>()
  const index = products.findIndex(p => p.id === id)
  if (index === -1) {
    throw new ErrorProductNotFound(id)
  }
  Object.assign(products[index], productData)
  await localforage.setItem('products', products)
  await localforage.setItem(id, productData)
  return productData
}

export const deleteProduct = async <P extends Product>(query: any): Promise<P[]> => {
  const products = await getProducts<P>()
  const [productsToDelete, productsToKeep] = partition<P>(sift<P>(query))(products)
  await localforage.setItem('products', productsToKeep)
  for await (const p of productsToDelete) {
    await localforage.removeItem(p.id)
  }
  return productsToDelete
}