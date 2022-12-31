import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { loader as rootLoader, Root } from "./pages/Root";
import { Catalog, loader as catalogLoader } from "./pages/Catalog";
import {
  ErrorBoundary as ProductViewErrorBoundary,
  loader as productViewLoader,
  ProductView
} from "./pages/ProductView";
import { action as productEditAction, loader as productEditLoader, ProductEdit } from "./pages/ProductEdit";
import { action as productAddAction, ErrorBoundary as ProductAddErrorBoundary, ProductAdd } from "./pages/ProductAdd";
import { action as productDeleteAction } from './pages/ProductDelete'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" loader={rootLoader} element={<Root/>} id="root">
      <Route index element={<Catalog/>} loader={catalogLoader}/>
      <Route path="/catalog"
             index
             element={<Catalog/>} loader={catalogLoader}/>
      <Route path="/catalog/add" element={<ProductAdd/>} action={productAddAction}
             index
             errorElement={<ProductAddErrorBoundary/>}/>
      <Route path="/catalog/products/:id" element={<ProductView/>}
             index
             loader={productViewLoader}
             errorElement={<ProductViewErrorBoundary/>}/>
      <Route path="/catalog/products/:id/edit" element={<ProductEdit/>}
             index
             action={productEditAction}
             loader={productEditLoader}/>
      <Route path="/catalog/products/:id/delete" action={productDeleteAction} />
    </Route>
  )
)

export const PageRoute = () => {
  return <RouterProvider router={router}/>
}