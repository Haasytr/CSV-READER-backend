import { Prisma, products } from "@prisma/client";
import { ProductsRepository } from "../products-repository";
import { Decimal } from "@prisma/client/runtime/library";
import toDecimal from "../../helpers/toDecimal";

export class InMemoryProductsRepository implements ProductsRepository {
  public items: products[] = [];

  async update(price: Decimal, code: bigint): Promise<products> {
    const product = this.items.find((item) => item.code === code);

    if (!product) {
      throw new Error("Product not found");
    }

    product.sales_price = price;

    return product;
  }

  async findByCode(code: bigint): Promise<products | null> {
    const measure = this.items.find((item) => item.code === code);

    if (!measure) {
      return null;
    }

    return measure;
  }

  async create(data: Prisma.productsCreateInput): Promise<products> {
    const product = {
      code: BigInt(data.code),
      name: data.name,
      cost_price: toDecimal(data.cost_price),
      sales_price: toDecimal(data.sales_price),
    };

    this.items.push(product);

    return product;
  }
}
