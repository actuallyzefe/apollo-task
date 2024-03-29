import express from "express";
import { signup, login, logout } from "./controller";
import { checkUser } from "./middleware";

export const AuthRoutes = express.Router();

AuthRoutes.post("/signup", signup);
AuthRoutes.post("/login", login);
AuthRoutes.post("/logout", checkUser, logout);
