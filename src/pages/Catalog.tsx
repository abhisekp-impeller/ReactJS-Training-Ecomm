import React, { FunctionComponent, Suspense } from "react";
import { Await, defer, json, Link, LoaderFunction, useFetcher, useLoaderData, useNavigate, } from "react-router-dom";
import { getProducts, seedProducts } from "~/datasource/product";
import { Product } from "~/types/Product";
import { CatalogProduct } from "@components/CatalogProduct";
import { Button, ButtonGroup } from "react-bootstrap";
import { CART_PAGE } from "~/constants/cart";
import { PRODUCT_ADD_PAGE, PRODUCT_BY_ID_PAGE } from "~/constants/product";

export const loader: LoaderFunction = async () => {
  const products = await getProducts<Product>({ deleted: false });

  if (products.length < 10) {
    const seededProductsPromise = seedProducts(10 - products.length);

    if (products.length === 0) {
      const seededProducts = await seededProductsPromise;
      return json({ products: seededProducts });
    }

    return defer({ products, seededProductsPromise });
  }

  return json({ products });
};

export interface CatalogProductViewProps extends Product {
}

export const CatalogProductView: FunctionComponent<CatalogProductViewProps> = ({
  ...product
}) => {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const handleAddToCart =
    (product: Product) =>
      async (ev: React.SyntheticEvent<HTMLButtonElement>) => {
        fetcher.submit(
          { productId: product.id, quantity: String(1) },
          {
            action: CART_PAGE,
            method: "post",
          }
        );
      };

  return (
    <React.Fragment>
      <CatalogProduct {...product} />
      <ButtonGroup>
        <Button
          variant="info"
          onClick={() => navigate(PRODUCT_BY_ID_PAGE.replace(":id", product.id))}
        >
          View
        </Button>
        <Button
          variant="primary"
          disabled={fetcher.state === "submitting"}
          onClick={handleAddToCart(product)}
        >
          Add to Cart
        </Button>
      </ButtonGroup>
    </React.Fragment>
  );
};

export const Catalog = () => {
  const { products, seededProductsPromise } = useLoaderData() as {
    products: Product[];
    seededProductsPromise?: Promise<Product[]>;
  };

  return (
    <>
      <h1>Catalog</h1>
      {products.length > 0 ? (
        products.map((product) => (
          <CatalogProductView key={product.id} {...product} />
        ))
      ) : (
        <p>
          No products found -{" "}
          <Link to={PRODUCT_ADD_PAGE}>
            <Button>Create a New Product</Button>
          </Link>
        </p>
      )}
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={seededProductsPromise}>
          {(seededProducts) =>
            seededProducts?.length > 0
              ? seededProducts.map((product: Product) => (
                <CatalogProductView key={product.id} {...product} />
              ))
              : null
          }
        </Await>
      </Suspense>
    </>
  );
};
