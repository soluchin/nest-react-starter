import { BadRequestException, Injectable, NotFoundException, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/entities/core/permission.entity';
import { Role } from 'src/entities/core/role.entity';
import { User } from 'src/entities/core/user.entity';
import { comparePasswords, hashPassword } from 'src/utils/password.util';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(entity: User, currentUser: string): Promise<User> {
    entity.createdBy = currentUser;
    entity.createdDate = new Date();
    entity.password = await hashPassword(entity.password);
    return await this.userRepository.save(entity);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findAllWithQuery(
    page: number,
    limit: number,
    filter: Record<string, 'ASC' | 'DESC'> = { createdDate: 'ASC' },
  ): Promise<User[]> {
    return await this.userRepository.find({
      order: filter as any,
      take: limit,
      skip: page,
    });
  }

  async findById(id: string): Promise<User> {
    const entity = await this.userRepository.findOne({
      where: {
        id: id as any,
      },
    });
    if (!entity) {
      throw new NotFoundException('User not found');
    }
    return entity;
  }

  async countRows(): Promise<number> {
    return await this.userRepository.count();
  }

  async findDropdownValues(): Promise<User[]> {
    return await this.userRepository.find({
      loadEagerRelations: false,
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
    return user;
  }

  async update(entity: User, currentUser: string): Promise<User> {
    const isExist: boolean = await this.userRepository.exists({
      where: {
        id: entity.id as any,
      },
    });
    if (!isExist) {
      throw new NotFoundException('User to update not found');
    }
    entity.password = await hashPassword(entity.password);
    entity.modifiedBy = currentUser;
    entity.modifiedDate = new Date();
    return await this.userRepository.save(entity);
  }

  async delete(id: string, currentUser: string): Promise<void> {
    const entity = await this.userRepository.findOne({
      where: {
        id: id as any,
      }
    });
    if (!entity) {
      throw new NotFoundException('User to delete not found');
    }
    await this.userRepository.delete(id);
  }

  async validatePassword(
    plainTextPassword: string,
    username: string,
  ): Promise<boolean> {
    const user = await this.findByUsername(username);
    if(!user){
      throw new UnauthorizedException();
    }
    const hashedPassword = user.password;
    return await comparePasswords(plainTextPassword, hashedPassword);
  }

  async createRole(entity: Role, currentUser: string): Promise<Role> {
    entity.createdBy = currentUser;
    entity.createdDate = new Date();
    return await this.roleRepository.save(entity);
  }

  async findAllRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findAllRolesWithQuery(
    page: number,
    limit: number,
    filter: Record<string, 'ASC' | 'DESC'> = { createdDate: 'ASC' },
  ) {
    return await this.roleRepository.find({
      order: filter as any,
      take: limit,
      skip: page,
    });
  }

  async findRoleById(id: string): Promise<Role> {
    const entity = await this.roleRepository.findOne({
      where: {
        id: id as any,
      },
    });
    if (!entity) {
      throw new NotFoundException('Role not found');
    }
    return entity;
  }

  async countRoleRows(): Promise<number> {
    return await this.roleRepository.count();
  }

  async updateRole(entity: Role, currentUser: string): Promise<Role> {
    const isExist: boolean = await this.roleRepository.exists({
      where: {
        id: entity.id as any,
      },
    });
    if (!isExist) {
      throw new NotFoundException('Role to update not found');
    }
    entity.modifiedBy = currentUser;
    entity.modifiedDate = new Date();
    return await this.roleRepository.save(entity);
  }

  async deleteRole(id: string, currentUser: string): Promise<void> {
    const entity = await this.roleRepository.findOne({
      where: {
        id: id as any,
      },
    });
    if (!entity) {
      throw new NotFoundException('Role to delete not found');
    }
    const userExist = await this.userRepository.findOne({
      where: {
        role: {
          id: id,
        },
      },
    });
    if (userExist) {
      throw new BadRequestException('Role cannot be deleted - it is still assigned to users');
    }
    await this.roleRepository.delete(id);
  }

  async findAllPermissionsWithQuery(
    page: number,
    limit: number,
    filter: Record<string, 'ASC' | 'DESC'> = { createdDate: 'ASC' },
  ) {
    return await this.permissionRepository.find({
      order: filter as any,
      take: limit,
      skip: page,
    });
  }

  async countPermissionRows(): Promise<number> {
    return await this.permissionRepository.count();
  }

  async findAllPermissions(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async findPermissionById(id: string): Promise<Permission> {
    const entity = await this.permissionRepository.findOne({
      where: {
        id: id as any,
      },
    });
    if (!entity) {
      throw new BadRequestException('Permission not found');
    }
    return entity;
  }
}

