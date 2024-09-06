import { FastifyReply, FastifyRequest } from "fastify";
import "@fastify/multipart";
import csv from "csv-parser";
import { pipeline } from "stream";
import { promisify } from "util";
import { makeUpdateProductsUseCase } from "@/use-cases/factories/make-update-products-use-case";
import { z } from "zod";

const pump = promisify(pipeline);

const productSchema = z.object({
  product_code: z.string(),
  new_price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
});

const productArraySchema = z.array(productSchema);

export async function update(req: FastifyRequest, res: FastifyReply) {
  const data = await req.file();

  if (!data) {
    return res.status(400).send({ message: "File not found" });
  }

  try {
    let result: Record<string, string>[] | null = [];

    await pump(data.file, csv(), async function* (source) {
      for await (const row of source) {
        result.push(row);
      }
    });

    const validatedCSV = productArraySchema.parse(result);

    const updateProductsUseCase = makeUpdateProductsUseCase();

    validatedCSV.map(async (product) => {
      return await updateProductsUseCase.execute({
        code: product.product_code,
        price: product.new_price,
      });
    });

    res.status(200).send();
  } catch (error) {
    return res.send(error);
  }
}
