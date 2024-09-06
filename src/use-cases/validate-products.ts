import { ProductsRepository } from "@/repositories/products-repository";
import { products } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { ProductNotFoundError } from "./errors/product-not-found-error";
import { SalePriceTooLowError } from "./errors/sale-price-too-lower-error";
import { PriceAdjustmentError } from "./errors/price-adjustment-error";

interface ValidateProductUseCaseRequest {
  price: string;
  code: string;
}

interface ValidateProductUseCaseResponse {
  code: number;
  name: string;
  current_price: Decimal;
  new_price: Decimal;
}

export class ValidateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    code,
    price,
  }: ValidateProductUseCaseRequest): Promise<ValidateProductUseCaseResponse> {
    const formmatedPrice = new Decimal(price);
    const formmatedCode = BigInt(code);

    const productExists = await this.productsRepository.findByCode(
      formmatedCode
    );

    if (!productExists) {
      throw new ProductNotFoundError(code);
    }

    if (formmatedPrice.lessThan(productExists.cost_price)) {
      throw new SalePriceTooLowError(code);
    }

    const minPrice = productExists.sales_price.mul(0.9);
    const maxPrice = productExists.sales_price.mul(1.1);

    if (
      formmatedPrice.lessThan(minPrice) ||
      formmatedPrice.greaterThan(maxPrice)
    ) {
      throw new PriceAdjustmentError(code);
    }

    return {
      code: Number(productExists.code),
      name: productExists.name,
      current_price: productExists.sales_price,
      new_price: formmatedPrice,
    };
  }
}
