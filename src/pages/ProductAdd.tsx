import { Form, redirect, useActionData, useRouteError } from 'react-router-dom'
import { addProduct } from '../ds/product-ds'
import { Product } from "../types/Product";
import { ProductErrors } from "../errors/product-errors";
import { CatalogProduct } from "../components/CatalogProduct";

export const action = async ({ request }: { request: Request }) => {
  const productFormData = await request.formData()
  console.log(productFormData);
  const productData = Object.fromEntries(productFormData.entries()) as unknown as Product
  console.log('Add Product', productData)

  try {
    const product = await addProduct<Product>(productData)
    return redirect(`/catalog/products/${product.id}`)
  } catch (e) {
    if (e instanceof ProductErrors) {
      return { errors: e }
    } else {
      throw e
    }
  }
}

export const ErrorBoundary = () => {
  const error = useRouteError() as Error
  return <><h1>Product Add Error</h1>
    <div>
      {String(error)}
    </div>
  </>
}

export const ProductAdd = () => {
  const { errors } = useActionData() as { errors: ProductErrors } || {}

  return (
    <div>
      <h1>Product Add</h1>
      <Form method="post">
        <CatalogProduct mode="add" errors={errors} />
        <button type="submit" className="btn btn-primary">Submit</button>
      </Form>
    </div>
  );
};