import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreateWarehouseDto, UpdateWarehouseDto, Role } from '@repo/types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Warehouse } from './warehouse.entity';
import { WarehouseService } from './warehouse.service';


@Controller('warehouses')
export class WarehousesController {
    constructor (private readonly warehousesService: WarehouseService) {}

    @Get()
    findAll(): Promise<Warehouse[]> {
        return this.warehousesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Warehouse> {
        return this.warehousesService.findOne(id);
    }

    @Post()
    @Roles(Role.Admin)
    create(@Body() dto: CreateWarehouseDto): Promise<Warehouse> {
        return this.warehousesService.create(dto);
    }

    @Patch(':id')
    @Roles(Role.Admin)
    update(@Param('id') id:string, @Body() dto: UpdateWarehouseDto):Promise<Warehouse> {
        return this.warehousesService.update(id,dto);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id:string): Promise<void> {
        return this.warehousesService.remove(id);
    }
}