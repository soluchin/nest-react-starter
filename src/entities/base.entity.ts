import { Column, PrimaryGeneratedColumn } from "typeorm";

export interface IBaseEntity{
  id: string;
  createdBy: string;
  createdDate: Date;
  modifiedBy: string;
  modifiedDate: Date;
}

export class BaseEntity<T> implements IBaseEntity{
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({name: 'created_date', nullable: true})
  createdDate: Date;

  @Column({name: 'created_by', nullable: true})
  createdBy: string;

  @Column({name: 'modified_date', nullable: true})
  modifiedDate: Date;

  @Column({name: 'modified_by', nullable: true})
  modifiedBy: string;

  constructor(entity: Partial<T>){
    Object.assign(this, entity);
  }
}