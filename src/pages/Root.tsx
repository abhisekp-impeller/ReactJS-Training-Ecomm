import {
  json,
  Outlet,
  ScrollRestoration,
  useLoaderData,
} from "react-router-dom";
import { Container, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCart } from "../datasource/cart";
import { Cart } from "../types/Cart";

export const loader = async () => {
  const cart = await getCart();
  const user = { name: "John" };
  return json({ user, cart });
};

export const Root = () => {
  const { cart } = useLoaderData() as { cart: Cart };

  return (
    <Container>
      <ScrollRestoration />
      <ToastContainer />
      <h1>ReactJS Training Ecommerce</h1>
      <Nav variant="pills" fill>
        <Nav.Item>
          <LinkContainer to="/catalog">
            <Nav.Link>Catalog</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/catalog/add">
            <Nav.Link>Add New Product</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/cart">
            <Nav.Link>Cart ({cart?.items?.length})</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      </Nav>
      <Outlet />
    </Container>
  );
};
