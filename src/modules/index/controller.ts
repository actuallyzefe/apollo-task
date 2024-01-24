import { getRepository, LessThan, MoreThan } from "typeorm";
import { User } from "../../entities/User";
import { Consumption } from "../../entities/Consumption";
import { Request, Response } from "express";
import { Index } from "../../entities/Index";

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

  try {
    const user = await userRepository.findOne(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newIndex: Index = indexRepository.create({
      date,
      value,
      user,
    });

    await indexRepository.save(newIndex);

    // Get the nearest previous and next index entries
    const previousIndex = await indexRepository.findOne({
      where: { user, date: LessThan(date) },
      order: { date: "DESC" },
    });
    const nextIndex = await indexRepository.findOne({
      where: { user, date: MoreThan(date) },
      order: { date: "ASC" },
    });

    // Calculate and save consumption for previous to current
    if (previousIndex) {
      const daysBetween =
        (new Date(date).getTime() - new Date(previousIndex.date).getTime()) /
        (1000 * 3600 * 24);
      const dailyConsumption =
        (newIndex.value - previousIndex.value) / daysBetween;

      for (let day = 1; day <= daysBetween; day++) {
        const consumptionDate = new Date(previousIndex.date);
        consumptionDate.setDate(consumptionDate.getDate() + day);

        const newConsumption = consumptionRepository.create({
          date: consumptionDate,
          value: dailyConsumption,
          user,
        });
        await consumptionRepository.save(newConsumption);
      }
    }

    // Calculate and save consumption for current to next
    if (nextIndex) {
      const daysBetween =
        (new Date(nextIndex.date).getTime() - new Date(date).getTime()) /
        (1000 * 3600 * 24);
      const dailyConsumption = (nextIndex.value - newIndex.value) / daysBetween;

      for (let day = 1; day < daysBetween; day++) {
        const consumptionDate = new Date(date);
        consumptionDate.setDate(consumptionDate.getDate() + day);

        const newConsumption = consumptionRepository.create({
          date: consumptionDate,
          value: dailyConsumption,
          user,
        });
        await consumptionRepository.save(newConsumption);
      }
    }

    return res.status(201).json(newIndex);
  } catch (error) {
    console.error("Error adding index: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
