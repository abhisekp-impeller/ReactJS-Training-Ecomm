import { json, Outlet, ScrollRestoration, useLoaderData, } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCart } from "../datasource/cart";
import { Cart } from "../types/Cart";
import { CART_PAGE } from "../constants/cart";
import { CATALOG_PAGE, PRODUCT_ADD_PAGE } from "~/constants/product";

export const loader = async () => {
  const cart = await getCart();
  const user = { name: "John" };
  return json({ user, cart });
};

export const Root = () => {
  const { cart } = useLoaderData() as { cart: Cart };

  return (
    <Container>
      <ScrollRestoration/>
      <ToastContainer/>

      <Navbar variant="dark" bg="dark">
        <Container>
          <Navbar.Brand>
            <LinkContainer to="/">
              <Nav.Link>ReactJS Training Ecommerce</Nav.Link>
            </LinkContainer>
          </Navbar.Brand>
          <Nav variant="pills" fill>
            <LinkContainer to={CATALOG_PAGE}>
              <Nav.Link>Catalog</Nav.Link>
            </LinkContainer>
            <LinkContainer to={PRODUCT_ADD_PAGE}>
              <Nav.Link>Add New Product</Nav.Link>
            </LinkContainer>
            <LinkContainer to={CART_PAGE}>
              <Nav.Link>Cart ({cart?.items?.length})</Nav.Link>
            </LinkContainer>
          </Nav>
        </Container>
      </Navbar>
      <Outlet/>
    </Container>
  );
};
