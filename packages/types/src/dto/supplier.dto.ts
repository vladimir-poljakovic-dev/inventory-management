import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateSupplierDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsEmail()
    contactEmail: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    address?: string;
}

export class UpdateSupplierDto {
    @IsString()
    @IsOptional()
    @MinLength(2)
    name?:string;

    @IsEmail()
    @IsOptional()
    contactEmail?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    address?: string;
}

export interface Supplier {
    id: string;
    name: string;
    contactEmail: string;
    phone: string | null;
    address: string | null;
    createdAt: string;
    updatedAt: string;
  }