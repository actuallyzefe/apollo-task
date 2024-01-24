import express from "express";
import { addIndex } from "./controller";

export const IndexRoutes = express.Router();

IndexRoutes.post("/add-index", addIndex);
