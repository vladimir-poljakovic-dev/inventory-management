import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {CreateProductDto, UpdateProductDto } from '@repo/types';
import { Repository } from "typeorm";
import { Product } from "./product.entity";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    findAll(categoryId?: string): Promise<Product[]> {
        if (categoryId) {
            return this.productRepository.find({
                where: { categoryId }
            });
        }
        return this.productRepository.find();
    }

    async findOne(id: string): Promise< Product> {
        const product = await this.productRepository.findOne({where: {id}});
        if (!product) throw new NotFoundException(`Product #${id} not found`);
        return product;
    }

    create(dto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(dto);
        return this.productRepository.save(product);
    }

    async update(id: string, dto: UpdateProductDto): Promise<Product> {
        const product = await this.findOne(id);
        Object.assign(product, dto);
        return this.productRepository.save(product);
    }

    async remove(id: string): Promise<void> {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }
}