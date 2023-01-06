export class ErrorProductAvailabilityNotLessThanZero extends Error {
  constructor(msg?: string) {
    super(msg || "Availability cannot be less than 0");
  }
}

export class ErrorProductPriceNotLessThanZero extends Error {
  constructor(msg?: string) {
    super(msg || "Price cannot be less than 0");
  }
}

export class ProductErrors extends Error {
  errors: {
    [key: string]: Error;
  };

  constructor(errors: { [key: string]: Error }) {
    super("Product is invalid");
    this.errors = errors;
  }
}

export class ErrorProductNotFound extends Error {
  constructor(productId: string, msg?: string) {
    super(msg || `No Product found with ID: ${productId}`);
  }
}

export class ErrorProductNotAvailable extends Error {
  constructor(productId: string, msg?: string) {
    super(msg || `Product with ID: ${productId} is not available`);
  }
}
