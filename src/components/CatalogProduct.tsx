import { FunctionComponent } from "react";
import { CatalogProductStyle } from "./CatalogProductStyle";
import { Product } from "../types/Product";
import { ProductDescriptionInput } from "./ProductDescriptionInput";
import { ProductErrors } from "../errors/product-errors";

export interface ProductProps extends Partial<Product> {
  mode?: 'add' | 'edit' | 'view';
  errors?: ProductErrors;
}

export const CatalogProduct: FunctionComponent<ProductProps> = ({
  id, name = "", price = 0, image = "", availability = 0, description= "", mode = 'view'
  , errors
}) => {
  return <CatalogProductStyle>
    <input type="text" name="id" id="id" defaultValue={id} hidden/>
    {/* Name */}
    <div className="form-group">
      <label htmlFor="name">Name</label>
      {mode === 'view' ? <p className="form-control">{name}</p> :
        <input defaultValue={name} type="text" className="form-control" id="name" name="name" placeholder="Enter name"
               required/>}
      {['add', 'edit'].includes(mode) && errors?.errors?.name &&
          <div className="alert alert-danger">{errors?.errors?.name?.message}</div>}
    </div>

    {/* Description */}
    <div className="form-group">
      <ProductDescriptionInput defaultValue={description} id="description" name="description"
                               error={errors?.errors?.description} mode={mode}/>
    </div>

    {/* Price */}
    <div className="form-group">
      <label htmlFor="price">Price</label>
      {mode === 'view' ? <p className="form-control">{price}</p> :
        <input defaultValue={price || 0} type="number" className="form-control" id="price" name="price"
               placeholder="Enter price" min={0} required/>}
      {['add', 'edit'].includes(mode) && errors?.errors?.price &&
          <div className="alert alert-danger">{errors?.errors?.price?.message}</div>}
    </div>

    {/* Availability */}
    <div className="form-group">
      <label htmlFor="availability">Availability</label>
      {mode === 'view' ? <p className="form-control">{availability}</p> :
        <input type="number" className="form-control" id="availability" name="availability"
               defaultValue={availability || 0} placeholder="Enter availability" min={0} required/>}
      {['add', 'edit'].includes(mode) && errors?.errors?.availability &&
          <div className="alert alert-danger">{errors?.errors?.availability?.message}</div>}
    </div>

    {/* Image */}
    <div className="form-group">
      <label htmlFor="image">Image</label>
      {mode === 'view' ? image ? <img alt="product" src={image}/> : <p className="form-control">N/A</p> :
        <input defaultValue={image} type="text" className="form-control" id="image" name="image"
               placeholder="Enter image"/>}
      {['add', 'edit'].includes(mode) && errors?.errors?.image &&
          <div className="alert alert-danger">{errors?.errors?.image?.message}</div>}
    </div>
  </CatalogProductStyle>
}