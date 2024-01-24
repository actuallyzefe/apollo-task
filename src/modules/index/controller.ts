import { getRepository, LessThan, MoreThan } from "typeorm";
import { User } from "../../entities/user";
import { Consumption } from "../../entities/consumption";
import { Request, Response } from "express";
import { Index } from "../../entities";

export async function addIndex(req: Request, res: Response) {
  const { userId, date, value } = req.body;

  if (value <= 0) {
    return res
      .status(400)
      .json({ message: "Index value must be greater than zero" });
  }

  const userRepository = getRepository(User);
  const indexRepository = getRepository(Index);
  const consumptionRepository = getRepository(Consumption);

  const user = await userRepository.findOne(userId);

  if (req.user?.userId !== userId) {
    res.clearCookie("jsonwebtoken");
    return res
      .status(403)
      .json({
        message: "you are not allowed to perform this action, logging you out.",
      });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const newIndex: Index = indexRepository.create({
    date,
    value,
    user,
  });

  await indexRepository.save(newIndex);

  const previousIndex = await indexRepository.findOne({
    where: { user, date: LessThan(date) },
    order: { date: "DESC" },
  });
  const nextIndex = await indexRepository.findOne({
    where: { user, date: MoreThan(date) },
    order: { date: "ASC" },
  });

  if (previousIndex) {
    const daysBetween =
      (new Date(date).getTime() - new Date(previousIndex.date).getTime()) /
      (1000 * 3600 * 24);
    const dailyConsumption =
      (newIndex.value - previousIndex.value) / daysBetween;

    for (let day = 0; day < daysBetween; day++) {
      const consumptionDate = new Date(previousIndex.date);
      consumptionDate.setDate(consumptionDate.getDate() + day);

      const existingConsumption = await consumptionRepository.findOne({
        where: { user, date: consumptionDate },
      });

      if (existingConsumption) {
        existingConsumption.value = dailyConsumption;
        await consumptionRepository.save(existingConsumption);
      } else {
        const newConsumption = consumptionRepository.create({
          date: consumptionDate,
          value: dailyConsumption,
          user,
        });
        await consumptionRepository.save(newConsumption);
      }
    }
  }

  if (nextIndex) {
    const daysBetween =
      (new Date(nextIndex.date).getTime() - new Date(date).getTime()) /
      (1000 * 3600 * 24);
    const dailyConsumption = (nextIndex.value - newIndex.value) / daysBetween;

    for (let day = 0; day <= daysBetween; day++) {
      const consumptionDate = new Date(date);
      consumptionDate.setDate(consumptionDate.getDate() + day);

      const existingConsumption = await consumptionRepository.findOne({
        where: { user, date: consumptionDate },
      });

      if (existingConsumption) {
        existingConsumption.value = dailyConsumption;
        await consumptionRepository.save(existingConsumption);
      } else {
        const newConsumption = consumptionRepository.create({
          date: consumptionDate,
          value: dailyConsumption,
          user,
        });
        await consumptionRepository.save(newConsumption);
      }
    }
  }

  return res.status(201).json(newIndex);
}
