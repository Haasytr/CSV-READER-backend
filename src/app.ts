import fastify from "fastify";
import multipart from "@fastify/multipart";
import { Routes } from "./https/controllers/routes";
import cors from "@fastify/cors";

export const app = fastify();
app.register(multipart);

app.register(Routes);
app.register(cors);
