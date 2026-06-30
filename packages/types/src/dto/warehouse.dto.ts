import { IsOptional, IsString, Min, MinLength } from "class-validator";

export interface WareHouse {
    id: string;
    name: string;
    location: string;
    description: string
    createdAt: string
    updatedAt: string;
}

export class CreateWarehouseDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @MinLength(2)
    location:string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateWarehouseDto {
    @IsString()
    @IsOptional()
    @MinLength(2)
    name: string;

    @IsString()
    @IsOptional()
    @MinLength(2)
    location?: string;

    @IsOptional()
    @IsString()
    description?: string;
}