import { Inject, NotFoundException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { IBaseEntity } from "src/entities/base.entity";
import { Repository } from "typeorm";

export class BaseService<T extends IBaseEntity>{
  constructor(
    private readonly repository: Repository<T>,
    @Inject(REQUEST) private readonly request
  ) {}

  protected getUserId(): string {
    return this.request.user.id || '';
  }

  protected getUserName(): string{
    return this.request.user.username || '';
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findAllWithQuery(
    page: number,
    limit: number,
    filter: Record<string, 'ASC' | 'DESC'> = { createdDate: 'ASC' },
  ): Promise<T[]> {
    return await this.repository.find({
      order: filter as any,
      take: limit,
      skip: page,
    });
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findOne({
      where: {id: id as any},
    });
    if (!entity) {
      throw new NotFoundException('Data not found');
    }
    return entity;
  }

  async create(entity: T): Promise<T> {
    entity.createdBy = this.getUserName()
    entity.createdDate = new Date();
    return await this.repository.save(entity);
  }

  async bulkCreate(entities: T[]): Promise<{ succeeded: T[]; failed: T[] }> {
    const currentDate = new Date();
    const userName = this.getUserName();
    const succeeded: T[] = [];
    const failed: T[] = [];
    entities = entities.map(entity => {
      entity.createdBy = userName;
      entity.createdDate = currentDate;
      return entity;
    });
    for (const entity of entities) {
      try {
        const savedEntity = await this.repository.save(entity);
        succeeded.push(savedEntity);
      } catch (error) {
        failed.push(entity);
      }
    }
    return { succeeded, failed };
  }

  async update(entity: T): Promise<T> {
    const isExist: boolean = await this.repository.exists({
      where: {id: entity.id as any},
    });
    if (!isExist) {
      throw new NotFoundException('Data to update not found');
    }
    entity.modifiedBy = this.getUserName()
    entity.modifiedDate = new Date();
    return await this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Data to delete not found');
    }
  }

  async countRows(): Promise<number> {
    return await this.repository.count();
  }

  async findDropdownValues(): Promise<T[]> {
    return await this.repository.find({
      loadEagerRelations: false,
    });
  }
}