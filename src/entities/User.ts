import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Index } from "./index.";
import { Consumption } from "./Consumption";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  companyName: string;

  @OneToMany(() => Index, (index) => index.user)
  indexes: Index[];

  @OneToMany(() => Consumption, (consumption) => consumption.user)
  consumptions: Consumption[];
}
