import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Consumption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "double precision" })
  value: number;

  @ManyToOne(() => User, (user) => user.consumptions)
  user: User;
}
