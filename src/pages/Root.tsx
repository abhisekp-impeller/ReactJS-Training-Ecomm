import { json, Outlet, ScrollRestoration, useNavigation } from "react-router-dom";
import { Container, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'

export const loader = async () => {
  const user = { name: "John" };
  return json({ user });
}

export const Root = () => {
  const { location } = useNavigation();
  return <Container>
    <ScrollRestoration/>
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
    </Nav>
    <Outlet/>
  </Container>
}