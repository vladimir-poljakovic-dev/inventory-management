import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, MinLength } from "class-validator";

export interface Product {
    id: string,
    name: string;
    sku: string;
    description: string | null;
    price: number;
    category: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export class CreateProductDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsUUID()
    categoryId: string;
}

export class UpdateProductDto {
    @IsString()
    @MinLength(2)
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    sku?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    price?: number;

    @IsUUID()
    @IsOptional()
    categoryId?: string;
}