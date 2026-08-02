import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export interface WareHouse {
  id: string;
  name: string;
  location: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export class CreateWarehouseDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  location: string;

  @IsString()
  @IsOptional()
  @MaxLength(60)
  description?: string;
}

export class UpdateWarehouseDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(60)
  description?: string;
}