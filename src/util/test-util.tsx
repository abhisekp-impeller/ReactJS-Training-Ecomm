import { createMemoryRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { render } from '@testing-library/react'
import { FunctionComponent, ReactElement } from "react";
import userEvent from "@testing-library/user-event";
import { Root } from "../routes/Root";

export const renderWithRouter = (routes: ReactElement) => {
  interface WrapperProps {
    routes: ReactElement
  }

  const Wrapper: FunctionComponent<WrapperProps> = ({ routes }) => {
    const router = createMemoryRouter(
      createRoutesFromElements(
        <Route path="/" id="root" element={<Root/>}>
          {routes}
          <Route path="*" element={<div>Not Found</div>}/>
        </Route>)
    )

    return <RouterProvider router={router}/>
  }

  return render(<Wrapper routes={routes}/>)
}

export * from '@testing-library/react';

export const user = userEvent.setup();