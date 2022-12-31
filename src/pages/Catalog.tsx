import React from 'react';
import { Link, LoaderFunction, useLoaderData, useNavigate } from 'react-router-dom';
import { getProducts } from "../ds/product-ds";
import { Product } from "../types/Product";
import { CatalogProduct } from "../components/CatalogProduct";
import { Button } from "react-bootstrap";

export const loader: LoaderFunction = async () => {
  const products = await getProducts<Product>()

  return { products }
}

export const Catalog = () => {
  const { products } = useLoaderData() as { products: Product[] }
  const navigate = useNavigate()

  return (
    <>
      <h1>Catalog</h1>
      {products.length > 0 ? products.map(product => (
        <React.Fragment key={product.id}>
          <CatalogProduct {...product} />
          <Button variant="primary" onClick={() => navigate(`/catalog/products/${product.id}`)}>View</Button>
        </React.Fragment>
      )) : <p>No products found - <Link to="/catalog/add"><Button>Create a New Product</Button></Link></p>}
    </>
  );
};