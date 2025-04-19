import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class PermissionGuard implements CanActivate{
  // TODO : Implement the PermissionGuard logic
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    throw new Error("Method not implemented.");
  }
}