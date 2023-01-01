import { WithAvailability, WithPrice } from "../types/Product";
import { ErrorProductAvailabilityNotLessThanZero, ErrorProductPriceNotLessThanZero } from "../errors/product-errors";

export const validateProduct = <P extends Partial<WithPrice> & Partial<WithAvailability>>(product: P) => {
  let errors: {
    [key: string]: Error;
  } | null = null;

  if (product.price! < 0) {
    errors = errors ?? {};
    errors.price = (new ErrorProductPriceNotLessThanZero())
  }

  if (product.availability! < 0) {
    errors = errors ?? {};
    errors.availability = (new ErrorProductAvailabilityNotLessThanZero())
  }

  return errors
}