import { ActionFunction, redirect } from "react-router-dom";
import { deleteProduct } from "../ds/product-ds";

export const action: ActionFunction = async ({ params }) => {
  const deletedProducts = await deleteProduct({ id: params.id });
  console.log('Deleted Products', deletedProducts);
  return redirect("/catalog");
}