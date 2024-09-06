import { FastifyInstance } from "fastify";
import { update } from "./update";
import { validate } from "./validate";

export async function Routes(app: FastifyInstance) {
  app.patch("/update", update);
  app.post("/validate", validate);
}
