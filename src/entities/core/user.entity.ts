import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../base.entity";
import { Role } from "./role.entity";

@Entity()
export class User extends BaseEntity<User> {
  @Column()
  username: string;
  
  @Column()
  password: string;
  
  @Column({nullable: true})
  refreshToken: string;

  @ManyToOne(() => Role, { nullable: true, eager: true })
  role: Role;
}
