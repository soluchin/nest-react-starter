# NestJS + React Starter Template

A full-stack monorepo starter template featuring **NestJS** as the backend API with **React SPA** served as static files. This template implements a Backend-for-Frontend (BFF) pattern with built-in authentication, role-based access control, and database integration using TypeORM.

## ✨ Features

- **Monorepo Structure** - Backend (NestJS) and Frontend (React) in a single repository
- **Backend for Frontend (BFF)** - React SPA served statically from NestJS
- **TypeORM Integration** - Database abstraction with support for SQLite (dev) and PostgreSQL (prod)
- **JWT Authentication** - Secure authentication using Passport.js with JWT strategy
- **Role-Based Access Control (RBAC)** - Permission-based authorization with custom decorators
- **Base Entity & Service** - Reusable base classes with audit fields (createdBy, createdDate, etc.)
- **Database Seeding** - Pre-configured seed script for initial users, roles, and permissions
- **Environment Configuration** - Centralized config with dotenv support

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| [NestJS](https://nestjs.com/) v11 | Progressive Node.js framework |
| [TypeORM](https://typeorm.io/) v0.3 | ORM for database operations |
| [Passport.js](http://www.passportjs.org/) | Authentication middleware |
| [JWT](https://jwt.io/) | Token-based authentication |
| [class-validator](https://github.com/typestack/class-validator) | DTO validation |
| [class-transformer](https://github.com/typestack/class-transformer) | Object transformation |
| SQLite / PostgreSQL | Database (dev/prod) |

### Frontend
| Technology | Purpose |
|------------|---------|
| [React](https://react.dev/) v19 | UI library |
| [Vite](https://vite.dev/) v6 | Build tool & dev server |

## 📁 Project Structure

```
nest-react-starter/
├── src/                        # NestJS Backend
│   ├── common/                 # Shared utilities & base classes
│   │   ├── base.service.ts     # Generic CRUD service
│   │   └── common.dto.ts       # Shared DTOs
│   ├── config/                 # Configuration files
│   │   ├── config.ts           # Environment config
│   │   ├── postgres.config.ts  # PostgreSQL TypeORM config
│   │   └── sqllite.config.ts   # SQLite TypeORM config
│   ├── core/                   # Core modules
│   │   ├── auth/               # Authentication module
│   │   │   ├── guards/         # JWT & Permission guards
│   │   │   └── strategy/       # Passport strategies
│   │   └── user/               # User management module
│   ├── decorators/             # Custom decorators
│   │   ├── permission.decorator.ts
│   │   └── public.decorator.ts
│   ├── entities/               # TypeORM entities
│   │   ├── base.entity.ts      # Base entity with audit fields
│   │   └── core/               # Core entities (User, Role, Permission)
│   ├── utils/                  # Utility functions
│   ├── app.module.ts           # Root module
│   ├── main.ts                 # Application entry point
│   └── seed.core.ts            # Database seeder
├── client/                     # React Frontend
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── test/                       # E2E tests
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- PostgreSQL (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nest-react-starter
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   APP_PORT=3000
   API_PREFIX=api
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-key
   JWT_EXPIRES_IN=1d
   JWT_REFRESH_TOKEN_EXPIRES_IN=30d
   
   # Database (PostgreSQL - for production)
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_database
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

5. **Seed the database**
   ```bash
   # Development (SQLite)
   npm run seed-core:dev
   
   # Production (PostgreSQL)
   npm run seed-core:prod
   ```

### Running the Application

#### Development Mode

1. **Start NestJS backend** (with hot reload)
   ```bash
   npm run start:dev
   ```

2. **Start React dev server** (in a separate terminal)
   ```bash
   cd client
   npm run dev
   ```

   - Backend API: `http://localhost:3000/api`
   - React Dev Server: `http://localhost:5173`

#### Production Mode

1. **Build the React client**
   ```bash
   cd client
   npm run build
   cd ..
   ```

2. **Build and start NestJS**
   ```bash
   npm run build
   npm run start:prod
   ```

   Both API and React SPA will be served from `http://localhost:3000`

## 🔐 Authentication & Authorization

### JWT Authentication Flow

1. User logs in via `/api/auth/login`
2. Server returns JWT access token
3. Client includes token in `Authorization: Bearer <token>` header
4. Global `JwtAuthGuard` validates all requests (except `@Public()` routes)

### Role-Based Permissions

```typescript
// Make route public (no auth required)
@Public()
@Get('public-data')
getPublicData() {}

// Require specific permissions
@Permissions('users.read', 'users.write')
@Get('admin-data')
getAdminData() {}
```

### Default Admin User

After seeding, use these credentials:
- **Username:** `admin`
- **Password:** `admin`

## 📝 Creating New Modules

1. **Create entity** extending `BaseEntity`
   ```typescript
   @Entity()
   export class Product extends BaseEntity<Product> {
     @Column()
     name: string;
   }
   ```

2. **Create service** extending `BaseService`
   ```typescript
   @Injectable({ scope: Scope.REQUEST })
   export class ProductService extends BaseService<Product> {
     constructor(
       @InjectRepository(Product) repo: Repository<Product>,
       @Inject(REQUEST) request,
     ) {
       super(repo, request);
     }
   }
   ```

3. **Register in `app.module.ts`**

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run start` | Start in development mode |
| `npm run start:dev` | Start with hot reload |
| `npm run start:prod` | Start production server |
| `npm run build` | Build for production |
| `npm run seed-core:dev` | Seed database (SQLite) |
| `npm run seed-core:prod` | Seed database (PostgreSQL) |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 🗄️ Database Configuration

- **Development:** SQLite (auto-created as `sqlite.db`)
- **Production:** PostgreSQL (configure via environment variables)

Both configurations use `synchronize: true` - **disable this in production** and use migrations instead.

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Passport.js Documentation](http://www.passportjs.org/docs/)

## 📄 License

This project is [MIT licensed](LICENSE).
