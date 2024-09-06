import { Prisma, products } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface ProductsRepository {
  update(price: Decimal, code: bigint): Promise<products>;
  create(data: Prisma.productsCreateInput): Promise<products>;
  findByCode(code: bigint): Promise<products | null>;
}
