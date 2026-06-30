import { Body,Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { CreateSupplierDto, UpdateSupplierDto } from "@repo/types";
import { Roles } from "../common/decorators/roles.decorator";
import { SupplierService } from "./suppliers.service";
import { Supplier } from "./supplier.entity";
import { Role } from "@repo/types";

@Controller('suppliers')
export class SuppliersController {
    constructor (private readonly suppliersService: SupplierService){}

    @Get()
    findAll(): Promise<Supplier[]> {
        return this.suppliersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:string): Promise<Supplier> {
        return this.suppliersService.findOne(id);
    }
    @Post()
    @Roles(Role.Admin)
    create(@Body()dto: CreateSupplierDto): Promise<Supplier>{
        return this.suppliersService.create(dto);
    }
    @Patch(':id')
    @Roles(Role.Admin)
    update( @Param('id') id: string, @Body() dto: UpdateSupplierDto,): Promise<Supplier> {
    return this.suppliersService.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string): Promise<void> {
    return this.suppliersService.remove(id);
  }
}