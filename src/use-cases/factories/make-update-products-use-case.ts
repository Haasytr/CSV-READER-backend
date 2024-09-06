import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { UpdateProductUseCase } from "../update-product";

export function makeUpdateProductsUseCase() {
  const productsRepository = new PrismaProductsRepository();
  const updateProductsUseCase = new UpdateProductUseCase(productsRepository);

  return updateProductsUseCase;
}
