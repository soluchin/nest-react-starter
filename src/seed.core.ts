import { DataSource, Repository } from 'typeorm';
import { Permission } from './entities/core/permission.entity';
import { randomUUID } from 'crypto';
import { Role } from './entities/core/role.entity';
import { User } from './entities/core/user.entity';
import { hashPassword } from './utils/password.util';
import * as readline from 'readline';

const AppDataSource = process.env.NODE_ENV === 'production' 
  ? new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'postgres',
      entities: [Permission, Role, User],
      synchronize: true,
    })
  : new DataSource({
      type: 'sqlite',
      database: 'sqlite.db',
      entities: [Permission, Role, User],
      synchronize: true,
    });

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function seed() {
  const answer = await askQuestion(
    'Are you sure to seed the database?\nThis action will affect current list of users, roles and permissions (y/n): '
  );

  if (answer.toLowerCase() !== 'y') {
    console.log('Seeding cancelled.');
    return;
  }
  
  await AppDataSource.initialize();

  const permissionRepository = AppDataSource.getRepository(Permission);
  const roleRepository = AppDataSource.getRepository(Role);
  const userRepository = AppDataSource.getRepository(User)

  await userRepository.clear()
  await roleRepository.clear()
  await permissionRepository.clear()

  // Permission Seeder ####################################################################
  // const permissionList = Object.values(Module).flatMap((module) =>
  //   Object.values(ModuleAction).map((action) => `${module}.${action}`),
  // );

  const permissionList = [];

  var permissions: Permission[] = [];

  var adminPermission = permissionRepository.create();
  adminPermission.id = randomUUID();
  adminPermission.name = 'all';
  permissions.push(adminPermission);

  for(const name of permissionList){
    if(await permissionRepository.exists({where: {name: name}})){
      continue
    }
    var permission = permissionRepository.create();
    permission.id = randomUUID();
    permission.name = name;
    permissions.push(permission);
  }

  await permissionRepository.save(permissions);

  // Role Seeder ####################################################################
  var role = roleRepository.create();
  role.id = randomUUID();
  role.createdBy = 'system';
  role.createdDate = new Date();
  role.name = 'admin';
  role.permissions = await permissionRepository.find({ where: { name: 'all' } });

  await roleRepository.save(role);

  // User Seeder ####################################################################
  var user = userRepository.create();
  user.id = randomUUID();
  user.createdBy = 'system';
  user.createdDate = new Date();
  user.username = 'admin';
  user.password = await hashPassword('admin');
  const adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
  if (!adminRole) {
    throw new Error('Admin role not found');
  }
  user.role = adminRole;

  await userRepository.save(user);

  // Seeding Complete ################################################################
  console.log('Seeding permissions and role complete!');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
});