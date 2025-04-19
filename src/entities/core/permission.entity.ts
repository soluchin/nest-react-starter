import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => Role, (role) => role.permissions, { nullable: true })
  roles: Role[];

  constructor(entity: Partial<Permission>){
    Object.assign(this, entity);
  }
}
