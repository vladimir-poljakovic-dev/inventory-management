import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, Role } from '@repo/types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ProductService } from './products.service';
import { Product } from './product.entity';

@Controller ('products')
export class ProductsController {
    constructor ( private readonly productsService: ProductService) {}

    @Get()
    findAll(@Query('categoryId') categoryid?: string): Promise<Product[]> {
        return this.productsService.findAll(categoryid);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Product> {
        return this.productsService.findOne(id);
    }

    @Post()
    @Roles(Role.Admin)
    create(@Body() dto: CreateProductDto): Promise<Product> {
        return this.productsService.create(dto);
    }

    @Patch(':id')
    @Roles(Role.Admin)
    update(
        @Param('id') id: string,
        @Body() dto: UpdateProductDto,
    ): Promise<Product> {
        return this.productsService.update(id, dto);
    }
    
    @Delete(':id')
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string): Promise<void> {
        return this.productsService.remove(id);
    }

}