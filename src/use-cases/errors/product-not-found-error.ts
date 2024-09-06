export class ProductNotFoundError extends Error {
  code: string;

  constructor(code: string) {
    super("Product not found");
    this.code = code;
  }
}
