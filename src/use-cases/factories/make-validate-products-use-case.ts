import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { ValidateProductUseCase } from "../validate-products";

export function makeValidateProductsUseCase() {
  const productsRepository = new PrismaProductsRepository();
  const validateProductsUseCase = new ValidateProductUseCase(
    productsRepository
  );

  return validateProductsUseCase;
}
