export class PriceAdjustmentError extends Error {
  code: string;

  constructor(code: string) {
    super(
      "The price adjustment cannot be greater or less than 10% of the current price"
    );
    this.code = code;
  }
}
