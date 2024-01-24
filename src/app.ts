import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import express from "express";
import { createConnection } from "typeorm";
import * as dotenv from "dotenv";
import { AuthRoutes } from "./modules/auth/route";
import { errorHandler } from "./utils/error-handler";
import { IndexRoutes } from "./modules/index/route";
dotenv.config();

createConnection()
  .then(async () => {
    const app = express();

    app.use(bodyParser.json());

    app.use(cookieParser());

    app.use("/auth", AuthRoutes);

    app.use("/index", IndexRoutes);

    app.use(errorHandler);

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error: ", error);
  });
