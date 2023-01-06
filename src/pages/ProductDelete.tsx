import { ActionFunction, redirect } from "react-router-dom";
import { softDeleteProductById } from "../datasource/product";
import { ErrorProductNotFound } from "../errors/product-errors";
import { toast } from "react-toastify";
import dedent from "dedent";
import { Product } from "../types/Product";

export const action: ActionFunction = async ({ params }) => {
  try {
    const product = await softDeleteProductById<Product>(params.id!);
    toast.success(dedent`
      Product: ${product.name} has been deleted.
    `);
    return redirect("/catalog");
  } catch (e) {
    if (e instanceof ErrorProductNotFound) {
      toast.error(e.message);
      return redirect("/catalog");
    }

    throw e;
  }
};
