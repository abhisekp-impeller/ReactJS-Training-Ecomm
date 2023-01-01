import React, { Suspense } from 'react';
import { Await, defer, Link, LoaderFunction, useLoaderData, useNavigate } from 'react-router-dom';
import { getProducts, seedProducts } from "../datasource/product";
import { Product } from "../types/Product";
import { CatalogProduct } from "../components/CatalogProduct";
import { Button } from "react-bootstrap";

export const loader: LoaderFunction = async () => {
  const products = await getProducts<Product>({ deleted: false })

  if (products.length < 10) {
    const seededProductsPromise = seedProducts(10 - products.length)

    if (products.length === 0) {
      const seededProducts = await seededProductsPromise;
      return { products: seededProducts }
    }

    return defer({ products, seededProductsPromise })
  }

  return ({ products })
}

export const Catalog = () => {
  const { products, seededProductsPromise } = useLoaderData() as { products: Product[], seededProductsPromise?: Promise<Product[]> }
  const navigate = useNavigate()

  return (
    <>
      <h1>Catalog</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={seededProductsPromise}>
          {seededProducts => seededProducts?.length > 0 ? seededProducts.map(product => (
            <React.Fragment key={product.id}>
              <CatalogProduct {...product} />
              <Button variant="primary" onClick={() => navigate(`/catalog/products/${product.id}`)}>View</Button>
            </React.Fragment>
          )) : null}
        </Await>
      </Suspense>
      {products.length > 0 ? products.map(product => (
        <React.Fragment key={product.id}>
          <CatalogProduct {...product} />
          <Button variant="primary" onClick={() => navigate(`/catalog/products/${product.id}`)}>View</Button>
        </React.Fragment>
      )) : <p>No products found - <Link to="/catalog/add"><Button>Create a New Product</Button></Link></p>}
    </>
  );
};