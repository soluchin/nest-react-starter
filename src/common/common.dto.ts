import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class GetDeleteByIdDto{
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class GetAllDto{
  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsObject()
  sort: Record<string, 'ASC' | 'DESC'>;
}