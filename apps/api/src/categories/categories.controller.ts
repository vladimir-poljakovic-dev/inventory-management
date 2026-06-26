import { Body,Controller,Delete,Get,HttpCode,HttpStatus,Param,Patch,Post,} from '@nestjs/common';
  import { CreateCategoryDto, UpdateCategoryDto, Role } from '@repo/types';
  import { Roles } from '../common/decorators/roles.decorator';
  import { CategoriesService } from './categories.service';
  import { Category } from './category.entity';
  
  @Controller('categories')
  export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
  
    @Get()
    findAll(): Promise<Category[]> {
      return this.categoriesService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Category> {
      return this.categoriesService.findOne(id);
    }
  
    @Post()
    @Roles(Role.Admin)
    create(@Body() dto: CreateCategoryDto): Promise<Category> {
      return this.categoriesService.create(dto);
    }
  
    @Patch(':id')
    @Roles(Role.Admin)
    update(
      @Param('id') id: string,
      @Body() dto: UpdateCategoryDto,
    ): Promise<Category> {
      return this.categoriesService.update(id, dto);
    }
  
    @Delete(':id')
    @Roles(Role.Admin)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string): Promise<void> {
      return this.categoriesService.remove(id);
    }
  }