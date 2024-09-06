import { products, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { ProductsRepository } from "../products-repository";
import { prisma } from "@/lib/prisma";

export class PrismaProductsRepository implements ProductsRepository {
  async update(price: Decimal, code: bigint): Promise<products> {
    const product = await prisma.products.update({
      where: {
        code,
      },
      data: {
        sales_price: price,
      },
    });

    return product;
  }
  async create(data: Prisma.productsCreateInput): Promise<products> {
    const product = await prisma.products.create({
      data,
    });

    return product;
  }
  findByCode(code: bigint): Promise<products | null> {
    return prisma.products.findUnique({
      where: {
        code,
      },
    });
  }
}
