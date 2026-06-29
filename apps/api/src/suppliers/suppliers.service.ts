import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateSupplierDto, UpdateSupplierDto } from '@repo/types';
import { Repository } from "typeorm";
import { Supplier } from "./supplier.entity";

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(Supplier)
        private readonly suppliersReposetory: Repository<Supplier>,
    ) {}

    findAll(): Promise<Supplier[]> {
        return this.suppliersReposetory.find();
    }

    async findOne(id:string): Promise<Supplier>{
        const supplier = await this.suppliersReposetory.findOne({where: {id}});
        if(!supplier) throw new NotFoundException(`Supplier #${id} not found`);
        return supplier;
    }
    
    create(dto: CreateSupplierDto): Promise<Supplier> {
        const supplier= this.suppliersReposetory.create(dto);
        return this.suppliersReposetory.save(supplier);
    }

    async update(id: string, dto: UpdateSupplierDto): Promise<Supplier>{
        const supplier = await this.findOne(id);
        Object.assign(supplier, dto);
        return this.suppliersReposetory.save(supplier);
    }

    async remove (id: string): Promise<void>{
        const supplier = await this.findOne(id);
        await this.suppliersReposetory.remove(supplier);
    }

}