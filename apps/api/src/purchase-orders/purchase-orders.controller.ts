import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { Role } from '@repo/types';
import { Roles } from '../common/decorators/roles.decorator';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrder } from './purchase-order.entity';
import { CreatePurchaseOrderRequest } from './create-purchase-order.dto';

@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Get()
  findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.findOne(id);
  }

  @Post()
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
    return this.purchaseOrdersService.create(dto);
  }
}