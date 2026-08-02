import { IsOptional, MinLength, MaxLength, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @MinLength(2)
    name:string;

    @IsString()
    @IsOptional()
    @MaxLength(60)
    description?:string;
}

export class UpdateCategoryDto {
    @IsString()
    @MinLength(2)
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(60)
    description?: string;
}

export interface Category {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  }






















