import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import mocksRouter from "./routes/mocks.routes.js";
import viewsRouter from "./routes/views.routes.js";
import sessionRouterFactory from "./routes/session.routes.js";
import { swaggerSpecs, swaggerUi } from "./config/swagger.config.js";

const app = express();

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/ecommerce";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB conectado (app.js)"))
  .catch(err => console.error("Error al conectar MongoDB:", err));

initializePassport(process.env.JWT_SECRET);
app.use(passport.initialize());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouterFactory(process.env.JWT_SECRET));
app.use("/api/mocks", mocksRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/", viewsRouter);

export default app;
