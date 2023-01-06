import {
  ActionFunction, json,
  Link,
  LoaderFunction,
  useLoaderData,
} from "react-router-dom";
import { addToCart, getCart } from "../datasource/cart";
import { Product } from "../types/Product";
import { Cart } from "../types/Cart";
import { getProductById } from "../datasource/product";
import { ErrorProductNotFound } from "../errors/product-errors";
import { Col, Image, Row, Table } from "react-bootstrap";

export const loader: LoaderFunction = async () => {
  const cart = await getCart();
  return json({ cart });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const productId = formData.get("productId") as string;
  const quantity = Number(formData.get("quantity"));
  const product = await getProductById<Product>(productId);

  if (!product) {
    throw new ErrorProductNotFound(productId);
  }

  return await addToCart<Product>(product, { quantity });
};

export const CartPage = () => {
  const { cart } = useLoaderData() as { cart: Cart<Product> };
  return (
    <div>
      <h1>Cart</h1>
      <Table borderless striped hover>
        <thead>
          <Row as="tr">
            <Col as="th" xs={1}>
              #
            </Col>
            <Col as="th">Product</Col>
            <Col as="th" xs={3}>
              Price per Unit
            </Col>
            <Col as="th" xs={2}>
              Quantity
            </Col>
            <Col as="th" xs={3}>
              Quantity Price
            </Col>
          </Row>
        </thead>
        <tbody>
          {cart.items.map((item, idx) => (
            <Row as="tr" key={item.id}>
              <Col as="td" xs={1}>
                {idx + 1}
              </Col>
              <Col as="td">
                <Link to={`/catalog/products/${item.product.id}`}>
                  <Row>
                    <Col xs={2}>
                      <Image rounded src={item.product.image} width={30} />
                    </Col>
                    <Col>
                      <Row>{item.product.name}</Row>
                    </Col>
                  </Row>
                </Link>
              </Col>
              <Col as="td" xs={3}>
                {item.product.price}
              </Col>
              <Col as="td" xs={2}>
                {item.quantity}
              </Col>
              <Col as="td" xs={3}>
                {item.price}
              </Col>
            </Row>
          ))}
        </tbody>

        {/* Total */}
        <Row as="tr">
          <Col as="th" xs={1} />
          <Col as="th" />
          <Col as="th" xs={3}>
            <strong>Total:</strong>
          </Col>
          <Col as="th" xs={2}>
            {cart.quantity}
          </Col>
          <Col as="th" xs={3}>
            {cart.price}
          </Col>
        </Row>
      </Table>
    </div>
  );
};
