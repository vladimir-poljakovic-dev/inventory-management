import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdjustStockDto, Role } from '@repo/types';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { StockService } from './stock.service';
import { Stock } from './stock.entity';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  findAll(): Promise<Stock[]> {
    return this.stockService.findAll();
  }

  @Post('adjust')
  @Roles(Role.Admin, Role.WarehouseManager)
  adjust(
    @Body() dto: AdjustStockDto,
    @CurrentUser('id') userId: string,
  ): Promise<Stock> {
    return this.stockService.adjust(dto, userId);
  }
}