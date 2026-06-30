import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {CreateWarehouseDto, UpdateWarehouseDto} from '@repo/types';
import { Repository } from "typeorm";
import { Warehouse } from "./warehouse.entity";

@Injectable()
export class WarehouseService {
    constructor(
        @InjectRepository(Warehouse)
        private readonly warehousesRepository: Repository<Warehouse>,
    ) {}

    findAll(): Promise<Warehouse[]> {
        return this.warehousesRepository.find();
    }

    async findOne(id: string): Promise<Warehouse> {
        const warehouse = await this.warehousesRepository.findOne({where: {id}});
        if (!warehouse) throw new NotFoundException(`Warehouse #${id} not found`);
        return warehouse;
    }

    create(dto:CreateWarehouseDto):Promise<Warehouse>{
        const warehouse = this.warehousesRepository.create(dto);
        return this.warehousesRepository.save(warehouse);
    }

    async update(id:string,dto:UpdateWarehouseDto): Promise<Warehouse>{
        const warehouse = await this.findOne(id);
        Object.assign(warehouse, dto);
        return this.warehousesRepository.save(warehouse);
    }

    async remove(id:string): Promise<void>{
        const warehouse = await this.findOne(id);
        await this.warehousesRepository.remove(warehouse);
    }
}