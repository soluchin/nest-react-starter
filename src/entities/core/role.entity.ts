import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Permission } from './permission.entity';

@Entity()
export class Role extends BaseEntity<Role> {
  @Column()
  name: string;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    nullable: true,
    eager: true,
  })
  @JoinTable()
  permissions: Permission[];
}
