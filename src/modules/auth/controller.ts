import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../../entities/a";

export async function signup(req: Request, res: Response) {
  const { email, password, companyName } = req.body;
  const userRepository = getRepository(User);

  const existingUser = await userRepository.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = userRepository.create({
    email,
    password: hashedPassword,
    companyName,
  });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      company: user.companyName,
    },
    process.env.JWT_SECRET!
  );

  res.cookie("jsonwebtoken", token);

  await userRepository.save(user);

  return res.status(201).json({ message: "User registered" });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const userRepository = getRepository(User);

  const user = await userRepository
    .createQueryBuilder("user")
    .addSelect("user.password")
    .where("user.email = :email", { email })
    .getOne();

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, company: user.companyName },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );

  res.cookie("jsonwebtoken", token);
  return res.json({ token });
}

export function logout(req: Request, res: Response) {
  return res.clearCookie("jsonwebtoken").sendStatus(200);
}
