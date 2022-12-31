import { CatalogProduct } from "../components/CatalogProduct";
import {
  Form,
  LoaderFunction,
  Params as LoaderParams,
  useLoaderData,
  useNavigate,
  useRouteError,
  useSubmit
} from "react-router-dom";
import { Product } from "../types/Product";
import { getProductById } from "../ds/product-ds";
import { ErrorProductNotFound } from "../errors/product-errors";
import React, { FunctionComponent, useCallback, useRef } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

export interface Params extends LoaderParams {
  id: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  const productId = (params as Params).id
  const product = await getProductById(productId)

  if (!product) {
    throw new ErrorProductNotFound(productId)
  }

  return { product }
}

export const ProductView = () => {
  const { product } = useLoaderData() as { product: Product };
  const submit = useSubmit()
  const deleteFormRef = useRef(null);
  const navigate = useNavigate()

  const handleDelete = useCallback(() => {
    if (deleteFormRef.current) {
      submit(deleteFormRef.current)
    }
  }, [submit])

  return (
    <div>
      <h1>Product View</h1>
      <Form ref={deleteFormRef} method="post" action={`/catalog/products/${product.id}/delete`}/>
      <CatalogProduct {...product} mode="view"/>
      <ButtonGroup>
        <Button variant="primary" onClick={() => navigate(`/catalog/products/${product.id}/edit`)}>Edit</Button>
        <Button type="submit" variant="danger" onClick={handleDelete}>Delete</Button>
      </ButtonGroup>
    </div>
  );
};

export const ErrorBoundary: FunctionComponent = () => {
  const error = useRouteError() as Error

  return <><h1>Product View Error</h1>
    {String(error)}
  </>
}