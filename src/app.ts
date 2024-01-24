import * as bodyParser from "body-parser";
import express from "express";
import { createConnection } from "typeorm";
import * as dotenv from "dotenv";
import { AuthRoutes } from "./modules/auth/route";
import { errorHandler } from "./utils/ErrorHandler";
import { IndexRoutes } from "./modules/index/route";
import { checkUser } from "./modules/auth/middleware";
import cookieParser from "cookie-parser";
dotenv.config();

createConnection()
  .then(async () => {
    const app = express();

    app.use(bodyParser.json());

    app.use(cookieParser());

    app.use(errorHandler);

    app.use("/auth", AuthRoutes);

    app.use(checkUser);
    app.use("/index", IndexRoutes);

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error: ", error);
  });
