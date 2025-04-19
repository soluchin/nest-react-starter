import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { UserService } from "src/core/user/user.service";
import { KEY_PERMISSIONS } from "src/decorators/permission.decorator";
import { KEY_IS_PUBLIC } from "src/decorators/public.decorator";

@Injectable()
export class PermissionGuard implements CanActivate{
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(KEY_IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;   
    }

    const [req] = context.getArgs();
    const userPermissions: string[] = (await this.userService.findById(req?.user?.id)).role.permissions.map(i => i.name.replace(':owned', '')) || [];
    const requiredPermissions = this.reflector.get<string[]>(KEY_PERMISSIONS, context.getHandler()) || [];

    if(userPermissions.includes('all'))return true;

    const hasAnyRequiredPermission = requiredPermissions.some(permission => userPermissions.includes(permission));

    if(requiredPermissions.length === 0 || hasAnyRequiredPermission){
      return true;
    }else{
      throw new ForbiddenException('Insufficient permissions');
    }
  }
}