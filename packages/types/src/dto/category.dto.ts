import { IsOptional, MinLength, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @MinLength(2)
    name:string;

    @IsString()
    @IsOptional()
    description?:string;
}

export class UpdateCategoryDto {
    @IsString()
    @MinLength(2)
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
























