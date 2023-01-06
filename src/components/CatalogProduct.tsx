import { FunctionComponent } from "react";
import { StyledCatalogProduct } from "./StyledCatalogProduct";
import { Product } from "../types/Product";
import { ProductDescriptionInput } from "./ProductDescriptionInput";
import { ProductErrors } from "../errors/product-errors";
import {
  FormControl,
  FormGroup,
  FormLabel,
  Image,
  InputGroup,
} from "react-bootstrap";

export interface ProductProps extends Partial<Product> {
  mode?: "add" | "edit" | "view";
  errors?: ProductErrors;
}

export const CatalogProduct: FunctionComponent<ProductProps> = ({
  id,
  name = "",
  price = 0,
  image = "",
  availability = 0,
  description = "",
  deleted = false,
  mode = "view",
  errors,
}) => {
  return (
    <StyledCatalogProduct>
      <FormControl
        type="text"
        name="id"
        id="id"
        defaultValue={id}
        hidden
      />
      <FormControl
        type="checkbox"
        name="deleted"
        defaultChecked={deleted}
        hidden
      />
      {/* Name */}
      <FormGroup>
        <FormLabel htmlFor="name">Name</FormLabel>
        <FormControl
          defaultValue={name}
          type="text"
          id="name"
          name="name"
          placeholder="Enter name"
          required
          readOnly={mode === "view"}
        />
        {["add", "edit"].includes(mode) && errors?.errors?.name && (
          <div className="alert alert-danger">
            {errors?.errors?.name?.message}
          </div>
        )}
      </FormGroup>

      {/* Description */}
      <FormGroup>
        <ProductDescriptionInput
          defaultValue={description}
          id="description"
          name="description"
          error={errors?.errors?.description}
          mode={mode}
        />
      </FormGroup>

      {/* Price */}
      <FormGroup>
        <FormLabel htmlFor="price">Price</FormLabel>
        <InputGroup>
          <InputGroup.Text>$</InputGroup.Text>
          <FormControl
            defaultValue={price || 0}
            type="number"
            id="price"
            name="price"
            placeholder="Enter price"
            min={0}
            required
            readOnly={mode === "view"}
          />
        </InputGroup>
        {["add", "edit"].includes(mode) && errors?.errors?.price && (
          <div className="alert alert-danger">
            {errors?.errors?.price?.message}
          </div>
        )}
      </FormGroup>

      {/* Availability */}
      <FormGroup>
        <FormLabel htmlFor="availability">Availability</FormLabel>
        <FormControl
          type="number"
          id="availability"
          name="availability"
          defaultValue={availability || 0}
          placeholder="Enter availability"
          min={0}
          required
          readOnly={mode === "view"}
        />
        {["add", "edit"].includes(mode) && errors?.errors?.availability && (
          <div className="alert alert-danger">
            {errors?.errors?.availability?.message}
          </div>
        )}
      </FormGroup>

      {/* Image */}
      <FormGroup>
        <FormLabel htmlFor="image">Image</FormLabel>
        {mode === "view" ? (
          image ? (
            <Image rounded alt="product" src={image} />
          ) : (
            <FormControl readOnly value="N/A" />
          )
        ) : (
          <FormControl
            defaultValue={image || ""}
            type="text"
            id="image"
            name="image"
            placeholder="Enter image"
          />
        )}
        {["add", "edit"].includes(mode) && errors?.errors?.image && (
          <div className="alert alert-danger">
            {errors?.errors?.image?.message}
          </div>
        )}
      </FormGroup>
    </StyledCatalogProduct>
  );
};
