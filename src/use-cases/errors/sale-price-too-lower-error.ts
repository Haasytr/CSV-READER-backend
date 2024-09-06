export class SalePriceTooLowError extends Error {
  code: string;

  constructor(code: string) {
    super("The sale price cannot be lower than the cost");

    this.code = code;
  }
}
