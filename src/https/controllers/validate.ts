import { FastifyReply, FastifyRequest } from "fastify";
import "@fastify/multipart";
import csv from "csv-parser";
import { pipeline } from "stream";
import { promisify } from "util";
import { z } from "zod";
import { makeValidateProductsUseCase } from "@/use-cases/factories/make-validate-products-use-case";

const pump = promisify(pipeline);

const productSchema = z.object({
  product_code: z.string(),
  new_price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
});

export async function validate(req: FastifyRequest, res: FastifyReply) {
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

    const validatedRows = result.map((row) => {
      const result = productSchema.safeParse(row);
      if (result.success) {
        return { data: result.data };
      } else {
        return {
          message: "Erro na validação do produto",
          code: row.product_code,
        };
      }
    });

    const validateProductsUseCase = makeValidateProductsUseCase();

    const failedProducts = validatedRows.filter((product) => product.message);

    if (failedProducts.length > 0) {
      return res.status(400).send(failedProducts);
    }

    const succesfullProducts = validatedRows.map((product) => {
      if (product.data) {
        return validateProductsUseCase.execute({
          code: product.data.product_code,
          price: product.data.new_price,
        });
      }
    });

    const resolvedProducts = await Promise.all(succesfullProducts);

    res.status(200).send(resolvedProducts);
  } catch (error) {
    return res.send(error);
  }
}
