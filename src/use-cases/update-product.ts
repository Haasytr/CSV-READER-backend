import { ProductsRepository } from "@/repositories/products-repository";
import { products } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { ProductNotFoundError } from "./errors/product-not-found-error";
import { SalePriceTooLowError } from "./errors/sale-price-too-lower-error";
import { PriceAdjustmentError } from "./errors/price-adjustment-error";

interface UpdateProductUseCaseRequest {
  price: string;
  code: string;
}

interface UpdateProductUseCaseResponse {
  product: products;
}

export class UpdateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    code,
    price,
  }: UpdateProductUseCaseRequest): Promise<UpdateProductUseCaseResponse> {
    const formmatedPrice = new Decimal(price);
    const formmatedCode = BigInt(code);

    const productExists = await this.productsRepository.findByCode(
      formmatedCode
    );

    if (!productExists) {
      throw new ProductNotFoundError();
    }

    if (formmatedPrice.lessThan(productExists.cost_price)) {
      throw new SalePriceTooLowError();
    }

    const minPrice = productExists.sales_price.mul(0.9);
    const maxPrice = productExists.sales_price.mul(1.1);

    if (
      formmatedPrice.lessThan(minPrice) ||
      formmatedPrice.greaterThan(maxPrice)
    ) {
      throw new PriceAdjustmentError();
    }

    const product = await this.productsRepository.update(
      formmatedPrice,
      formmatedCode
    );

    product.code.toString();

    return { product };
  }
}
