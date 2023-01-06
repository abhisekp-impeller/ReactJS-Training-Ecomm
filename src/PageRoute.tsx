import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import { loader as rootLoader, Root } from "./pages/Root";
import { Catalog, loader as catalogLoader } from "./pages/Catalog";
import {
  ErrorBoundary as ProductViewErrorBoundary,
  loader as productViewLoader,
  ProductView,
} from "./pages/ProductView";
import { action as productEditAction, loader as productEditLoader, ProductEdit, } from "./pages/ProductEdit";
import { action as productAddAction, ErrorBoundary as ProductAddErrorBoundary, ProductAdd, } from "./pages/ProductAdd";
import { action as productDeleteAction } from "./pages/ProductDelete";
import { action as cartAction, CartPage, loader as cartLoader, } from "@pages/cart";
import { CART_PAGE } from "./constants/cart";
import {
  CATALOG_PAGE,
  PRODUCT_ADD_PAGE,
  PRODUCT_BY_ID_PAGE,
  PRODUCT_DELETE_PAGE,
  PRODUCT_EDIT_PAGE
} from "./constants/product";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" loader={rootLoader} element={<Root/>} id="root">
      <Route index element={<Navigate to={CATALOG_PAGE} replace/>} loader={catalogLoader}/>
      <Route
        path={CATALOG_PAGE}
        element={<Catalog/>}
        loader={catalogLoader}
      />
      <Route
        path={PRODUCT_ADD_PAGE}
        element={<ProductAdd/>}
        action={productAddAction}
        index
        errorElement={<ProductAddErrorBoundary/>}
      />
      <Route
        path={PRODUCT_BY_ID_PAGE}
        element={<ProductView/>}
        index
        loader={productViewLoader}
        errorElement={<ProductViewErrorBoundary/>}
      />
      <Route
        path={PRODUCT_EDIT_PAGE}
        element={<ProductEdit/>}
        index
        action={productEditAction}
        loader={productEditLoader}
      />
      <Route path={PRODUCT_DELETE_PAGE} action={productDeleteAction}/>
      <Route
        path={CART_PAGE}
        element={<CartPage/>}
        action={cartAction}
        loader={cartLoader}
      />
    </Route>
  )
);

export const PageRoute = () => {
  return <RouterProvider router={router}/>;
};
