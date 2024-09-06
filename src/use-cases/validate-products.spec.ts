import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryProductsRepository } from "../repositories/ in-memory/in-memory-products-repository";
import { PriceAdjustmentError } from "./errors/price-adjustment-error";
import { SalePriceTooLowError } from "./errors/sale-price-too-lower-error";
import { ValidateProductUseCase } from "./validate-products";

let productsRepository: InMemoryProductsRepository;
let sut: ValidateProductUseCase;

describe("List measure Use Case", () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new ValidateProductUseCase(productsRepository);
  });

  it("Should be able to validate a product's price", async () => {
    await productsRepository.create({
      code: 1,
      cost_price: 15.2,
      sales_price: 16.5,
      name: "Teste",
    });

    const { new_price } = await sut.execute({
      code: "1",
      price: "16.8",
    });
    expect(new_price.toNumber()).toEqual(16.8);
  });

  it("SHould not be able to lower the price more than the cost_price", async () => {
    await productsRepository.create({
      code: 1,
      cost_price: 15.2,
      sales_price: 16.5,
      name: "Teste",
    });

    expect(async () => {
      await sut.execute({
        code: "1",
        price: "15.1",
      });
    }).rejects.toBeInstanceOf(SalePriceTooLowError);
  });

  it("The new reajusted price cannot be higher or lower than 10% of the previous price", async () => {
    await productsRepository.create({
      code: 1,
      cost_price: 15.2,
      sales_price: 16.5,
      name: "Teste",
    });

    expect(async () => {
      await sut.execute({
        code: "1",
        price: "18.3",
      });
    }).rejects.toBeInstanceOf(PriceAdjustmentError);
  });
});
