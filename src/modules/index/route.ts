import express from "express";
import { addIndex } from "./controller";
import { checkUser } from "../auth/middleware";

export const IndexRoutes = express.Router();

IndexRoutes.post("/add-index", checkUser, addIndex);
