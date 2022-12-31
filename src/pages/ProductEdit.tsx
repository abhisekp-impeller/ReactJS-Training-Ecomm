import { CatalogProduct } from "../components/CatalogProduct";
import type { Product } from "../types/Product";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  Params as LoaderParams,
  redirect,
  useActionData,
  useLoaderData,
  useSubmit
} from "react-router-dom";
import { getProductById, updateProductById } from "../ds/product-ds";
import { ProductErrors } from "../errors/product-errors";
import { Button, ButtonGroup } from "react-bootstrap";
import React, { useCallback, useRef } from "react";

export const action: ActionFunction = async ({ request }) => {
  const productFormData = await request.formData();
  console.log(productFormData);
  const productData = Object.fromEntries(productFormData.entries()) as unknown as Product
  console.log('Edit Product', productData)

  try {
    const product = await updateProductById<Product>(productData.id, productData)
    return redirect(`/catalog/products/${product.id}`)
  } catch (e) {
    if (e instanceof ProductErrors) {
      return { errors: e }
    } else {
      throw e
    }
  }
}

export interface Params extends LoaderParams {
  id: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  const productId = (params as Params).id
  const product = await getProductById(productId)

  return { product }
}

export const ProductEdit = () => {
  const { product } = useLoaderData() as { product: Product };
  const { errors } = useActionData() as { errors: ProductErrors } || {}
  const submit = useSubmit()
  const deleteFormRef = useRef(null);

  const handleDelete = useCallback(() => {
    if (deleteFormRef.current) {
      submit(deleteFormRef.current)
    }
  }, [submit])

  return (
    <div>
      <h1>Product Edit</h1>
      <Form ref={deleteFormRef} method="post" action={`/catalog/products/${product.id}/delete`} />
      <Form method="put">
        <CatalogProduct {...product} errors={errors} mode="edit"/>
        <ButtonGroup>
          <Button type="submit" variant="primary">Submit</Button>
          <Button type="button" variant="danger" onClick={handleDelete}>Delete</Button>
        </ButtonGroup>
      </Form>
    </div>
  );
};